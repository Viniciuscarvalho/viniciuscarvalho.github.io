---
layout: post
title:  "Different architectural approaches to the same problem"
date:   2025-09-03 12:00:36 +0530
categories: Swift, SwiftUI, iOS, Architecture
---

Hoje vou tentar trazer um pouco como fiz a troca de arquitetura de uma aplicação que estava em MVVM para VIP-Clean em SwiftUI. Também vou
tentar escrever esse artigo em inglês, por isso já peço a desculpas pelos erros de antemão, beleza?

Let's do it.

## Problem

The case in question involved some errors in an application that was adopting MVVM to display data on the application screen. The aim here is not to show how MVVM itself works, but how the change was made to use another architecture, VIP. I like to call
it a VIP scene, which is the presentation of the application screens.

The app is working but some elements are missing in MVVM, but I would like to use what I am used to, which is VIP, so I ended up creating
the layers separately without having to change what was still working. Next, I will discuss what was created and how each of the 
layers turned out, and show a structural design of how they interconnect, thinking at a higher level.

Let's say these are the requirements for the application in question: display a list of tweets and a famous app in China called WeChat or something similar to it. We have a profile image, avatar, and a list of tweets. We will also have a refresh when we pull down, and only the first five items are shown after loading.

## Pieces of Architecture

To start a scene, I needed to create the basis for what I was going to attach to the project, so I started creating everything necessary to apply VIP.
I created the Repository, Interactor, Presenter, and ViewState folders, which are the basic parts for our implementation shell.

![Folders](https://imgur.com/qQfbJou.png)

### Repository

```Swift
protocol TweetsRepositoryProtocol: AnyObject {
    func fetchAll() async throws -> [Tweet]
}

final class TweetsRepository: TweetsRepositoryProtocol {
    private let url: URL
    private let session: URLSession
    
    init(url: URL, session: URLSession = .shared) {
        self.url = url
        self.session = session
    }
    
    func fetchAll() async throws -> [Tweet] {
        let (data, response) = try await session.data(from: url)
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw URLError(.badServerResponse)
        }
        
        let dtos = try JSONDecoder().decode([TweetDTO].self, from: data)
        return dtos.compactMap(TweetMapper.map)
    }
}
```

### Interactor

```Swift
protocol TweetsInteractorProtocol: AnyObject {
    func initialLoad() async
    func refresh() async
    func loadMoreIfNeeded(lastVisibleID: UUID) async
}

@MainActor
final class TweetsInteractor: TweetsInteractorProtocol {
    private let repo: TweetsRepositoryProtocol
    private let presenter: TweetsPresenterProtocol
    
    private var allTweets: [Tweet] = []
    private var visibleCount = 0
    private var pageSize = 5
    private var hasLoadedOnce = false
    
    // MARK: - Initialize
    
    init(
        repo: TweetsRepositoryProtocol,
        presenter: TweetsPresenterProtocol
    ) {
        self.repo = repo
        self.presenter = presenter
    }
    
    // MARK: - Functions
    
    func initialLoad() async {
        guard !hasLoadedOnce else {
            presenter.present(all: allTweets, visibleCount: visibleCount)
            return
        }
        
        do {
            allTweets = try await repo.fetchAll()
            hasLoadedOnce = true
            visibleCount = min(pageSize, allTweets.count)
            presenter.present(all: allTweets, visibleCount: visibleCount)
        } catch {
            allTweets = []
            visibleCount = 0
            presenter.present(all: [], visibleCount: 0)
        }
    }
    
    func refresh() async {
        if hasLoadedOnce {
            visibleCount = min(pageSize, allTweets.count)
            presenter.presentRefreshing(all: allTweets, visibleCount: visibleCount)
            return
        }
        await initialLoad()
    }
    
    func loadMoreIfNeeded(lastVisibleID: UUID) async {
        guard let lastRowID = allTweets.prefix(visibleCount).last?.id, lastRowID == lastVisibleID else { return }
        
        let newCount = min(visibleCount + pageSize, allTweets.count)
        guard newCount != visibleCount else { return }
        visibleCount = newCount
        presenter.present(all: allTweets, visibleCount: visibleCount)
    }
}
```

### Presenter

```Swift
protocol TweetsPresenterProtocol: AnyObject {
    func present(all: [Tweet], visibleCount: Int)
    func presentRefreshing(all: [Tweet], visibleCount: Int)
}

@MainActor
final class TweetsPresenter: TweetsPresenterProtocol {
    weak var view: TweetsDisplayLogic?
    
    func present(all: [Tweet], visibleCount: Int) {
        view?.display(state: makeState(all: all, visibleCount: visibleCount, isRefreshing: false))
    }
    
    func presentRefreshing(all: [Tweet], visibleCount: Int) {
        view?.display(state: makeState(all: all, visibleCount: visibleCount, isRefreshing: true))
    }
    
    // MARK: - Private Functions
    
    private func makeState(all: [Tweet], visibleCount: Int, isRefreshing: Bool) -> TweetsViewState {
        let clamp = min(visibleCount, all.count)
        let slice = Array(all.prefix(clamp))
        
        let rows = slice.map { t in
            TweetRowState(
                id: t.id,
                name: displayName(for: t.sender),
                avatarURL: t.sender.avatarURL,
                content: t.content,
                imageURLs: t.imageURLs,
                comments: t.comments
            )
        }
        return TweetsViewState(
            headerUser: pickHeaderUser(from: all),
            rows: rows,
            isLoading: isRefreshing,
            canLoadMore: clamp < all.count
        )
    }
    
    private func displayName(for user: User) -> String {
        if let nick = user.nick, !nick.isEmpty { return nick }
        if let username = user.username, !username.isEmpty { return "@\(username)" }
        return "unknown"
    }
    
    private func pickHeaderUser(from all: [Tweet]) -> User? {
        if let withProfile = all.first(where: { $0.sender.profileURL != nil }) {
            return withProfile.sender
        }
        return all.first?.sender
    }
}
```

### ViewState

```Swift
@MainActor
protocol TweetsDisplayLogic: AnyObject {
    func display(state: TweetsViewState)
}

struct TweetRowState: Identifiable, Hashable {
    let id: UUID
    let name: String
    let avatarURL: URL?
    let content: String?
    let imageURLs: [URL]
    let comments: [Comment]
}

struct TweetsViewState: Equatable {
    var headerUser: User?
    var rows: [TweetRowState] = []
    var isLoading: Bool = false
    var canLoadMore: Bool = false
}
```

Here, it would not be necessary to create this Adapter, but since I wanted to remove the responsibility that was coupled to the View, I thought it would be better to create this Adapter between the ViewState and just call the Adapter directly in the View, without having to create a class reference in the view layer.

### Adapter

```Swift
@MainActor
final class TweetsAdapter: ObservableObject, TweetsDisplayLogic {
    @Published var state = TweetsViewState()
    
    func display(state: TweetsViewState) {
        withAnimation(.easeInOut(duration: 0.2)) {
            self.state = state
        }
    }
}
```

At last, I will show how it was presented in View, not showing View itself, because that is not the goal, but how I plugged in the other layers, making it easier for testing and separating logic, as well as for growing the application.

### View, only for plug other layers

```Swift
struct TweetView: View {
    @ObservedObject var adapter: TweetsAdapter
    @State private var isFirstAppear = true
    
    // MARK: - Properties
    
    private let interactor: TweetsInteractorProtocol

    // MARK: - Init
    
    init(adapter: TweetsAdapter, interactor: TweetsInteractorProtocol) {
        self.adapter = adapter
        self.interactor = interactor
    }

    // MARK: - View
    
    var body: some View {
        NavigationView {
            List {
                HeaderView(user: adapter.state.headerUser)
                
                ForEach(adapter.state.rows) { row in
                    TweetRowView(row: row)
                        .onAppear {
                            Task { await interactor.loadMoreIfNeeded(lastVisibleID: row.id) }
                        }
                }
                
                if adapter.state.canLoadMore {
                    HStack {
                        Spacer()
                        ProgressView()
                        Spacer()
                    }
                    .listRowSeparator(.hidden)
                }
            }
            .listStyle(.plain)
            .navigationTitle("Moments")
            .refreshable {
                await interactor.refresh()
            }
            .task {
                if isFirstAppear {
                    isFirstAppear = false
                    await interactor.initialLoad()
                }
            }
        }
    }
```

## Explain Layers and Connections

![System Design](https://imgur.com/JB9LHZq.png)

Now, explaining a little about how this communication between layers was done, in the structure, we have the Service that was changed to my *Repository*, where I can communicate directly with my API. This is where it fetches the data that is in my TweetDTO and has all the mapping of the information that I want to display on the screen. There's no mystery here, just simple decoding and use of async await, already addressing a newer concept in Swift.

Then we move on to the *Interactor*, where we will have the refresh, initialLoad, and loadMoreIfNeeded functions, all of which are exposed through *Protocols*. Look at how important they are at the time of our implementation, as they will basically be responsible for carrying the tweets that are coming from the *Presenter*, which will perform this communication, as we can see that it is instantiated in the init of my Interactor.

Following the flow, we move on to the *Presenter*, which will basically be responsible for having the display to integrate with the *ViewState*, always using communication through protocols, never implementing directly in the class so that we can easily perform tests and use dependency inversion at test time, okay? This is a concept similar to *Interface* that we had in ObjC (I feel old talking about this here), but it is so that we do not implement it in the concrete class and expose it through Protocols.

So far, the flow according to the design is clear, right?

Finally, let's connect the *ViewState* to our *View*, which we can see being connected to the ObservedObject in our View, in addition to having an instance of the Interactor to perform our refresh, simply using

```Swift
.refreshable {
    await interactor.refresh()
}
```

Our View, as presented in the code, has other components such as HeaderView and CommentRow, but the intention here is to show how the layers were connected and not to go directly into the code itself, presenting the approach used and which was changed to VIP.

But Vinicius, you didn't explain what that *Router* is there, loose and without any connection. Let's say that layer is like a connection to the outside world, or a navigation point to other features in different modules. I wanted to make this transformation to VIP precisely to be able to show the visualization of DI and Container usage that I couldn't easily see with MVVM. These communication concepts are seen in a library called [RouterService](https://github.com/rockbruno/RouterService), where I can talk a little more about navigation and deep links in SwiftUI, which is a very cool topic.

For an upcoming article, I will write more about dependency injection and some frameworks for it in iOS, as well as a little more about Mobile System Design, which is a subject I am studying extensively.

Até a próxima, See ya!


