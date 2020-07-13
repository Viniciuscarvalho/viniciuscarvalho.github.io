import Foundation
import Publish
import Plot
import SplashPublishPlugin

try SwiftBlogWebsite().publish(
    withTheme: .swiftBlogWebsite,
    additionalSteps: [.deploy(using: .gitHub("viniciuscarvalho/viniciuscarvalho.github.io"))],
    plugins: [.splash(withClassPrefix: "")]
)

