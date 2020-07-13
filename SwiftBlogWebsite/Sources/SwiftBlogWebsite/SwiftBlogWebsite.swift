//
//  File.swift
//  
//
//  Created by Vinicius Carvalho Marques on 22/04/20.
//

import Foundation
import Publish
import Plot

// This type acts as the configuration for your website.
struct SwiftBlogWebsite: Website {
    enum SectionID: String, WebsiteSectionID {
        // Add the sections that you want your website to contain here:
        case posts
        case about
    }

    struct ItemMetadata: WebsiteItemMetadata {
        // Add any site-specific metadata that you want to use here.
        var except: String
    }

    // Update these properties to configure your website:
    var url = URL(string: "https://theswiftmah.com.br")!
    var title = "The Swift Mah"
    var name = "Vinicius Carvalho"
    var description = "Desenvolvedor iOS "
    var language: Language { .portuguese }
    var imagePath: Path? { nil }
    var socialMediaLinks: [SocialMediaLink] { [.location, .linkedIn, .email, .github, .twitter] }
}
