domPad

domPad is a browser-based website builder and content management system built around GitHub repositories. It uses a flat-file approach: website content, configuration, media indexes, and commerce data are represented as files in a repository, while the domPad dashboard provides the interface for managing them.

The project is designed around a lightweight, client-side web application architecture using HTML, CSS, and JavaScript.

> **Project status:** domPad is actively being developed and debugged. Features across the dashboard, website runtime, and integrations may continue to change.

Overview

domPad has two related application environments:

• Dashboard — the management application used to create and manage websites and their content.
• Managed websites — the websites created and maintained through the dashboard. Their runtime loads the relevant application code and renders the site’s pages.

The dashboard and managed websites currently have separate MVC implementations. The intended direction is to converge them on a shared mvc.js, while placing environment-specific functionality in framework.js. That consolidation is planned; it should not be mistaken for the current implementation.

Core dashboard modules

The dashboard is organized into seven main modules:

|Module    |Purpose                                                                                    |
|----------|-------------------------------------------------------------------------------------------|
|**Build** |Website build tools, page builder, preview, deployment status, and related build workflows.|
|**Config**|Site information, branding, checkout/payment settings, deployment options, and domains.    |
|**Files** |Repository file management and uploads.                                                    |
|**Media** |Audio, photo, and video library management.                                                |
|**Merch** |Product catalog, product editing, orders, and commerce workflows.                          |
|**Pages** |Website page list and page-specific settings.                                              |
|**Posts** |Blog/article management and editing.                                                       |

The broader project setup flow is intended to guide a site through onboarding, pages, builder, files, media, posts, merchandising, and deployment.

Technology

The repository currently uses:

• HTML5 and CSS
• Vanilla JavaScript and browser APIs
• JSON files for structured site data
• GitHub REST API for repository and content operations
• GitHub OAuth / access-token-based authentication
• Stripe integration for payment workflows
• Cloudflare Workers for supporting server-side endpoints
• Cloudflare Pages for hosting and continuous deployment

The application is built primarily with browser-loaded scripts and global application objects rather than a conventional bundled JavaScript toolchain. The repository does not currently use a package.json-based build setup.

Repository structure

The following is a guide to the major directories and files. It is not an exhaustive listing of every asset.

Repository Structure

dompad/
├── index.html                  # Dashboard application document
├── index.js                    # Dashboard startup and initialization
├── index.css                   # Dashboard base styles
├── site.webmanifest            # Web app manifest
├── sw.js                       # Service worker
├── worker.js                   # Worker-related code
│
└── raw/
    ├── asset/
    │   ├── css/                # Shared and component stylesheets
    │   ├── html/               # HTML components and templates
    │   │   ├── block/          # Reusable content blocks
    │   │   ├── error/          # Error-page templates
    │   │   ├── modal/          # Modal templates
    │   │   ├── template/       # Application and editor templates
    │   │   └── tool/           # Builder tool templates
    │   ├── js/                 # Dashboard and runtime JavaScript
    │   ├── json/               # Static JSON configuration and data
    │   ├── png/                # Raster images and illustrations
    │   ├── psd/                # Design source files
    │   ├── svg/                # Vector icons and illustrations
    │   └── xml/                # XML configuration assets
    │
    ├── pages/                  # Dashboard and application page templates
    │
    └── style/
        ├── framework.js        # JavaScript framework and DOM behavior
        ├── template.html       # Dashboard application shell
        └── theme.css           # Theme styles
        

Important JavaScript files

|File                         |Current role                                |
|-----------------------------|--------------------------------------------|
|`index.js`                   |Dashboard entry point and initialization.   |
|`raw/asset/js/mvc.m.js`      |Dashboard model-side utilities.             |
|`raw/asset/js/mvc.v.js`      |Dashboard view and rendering logic.         |
|`raw/asset/js/mvc.c.js`      |Dashboard controller and feature workflows. |
|`raw/asset/js/mvc.js`        |MVC implementation used by managed websites.|
|`raw/asset/js/router.js`     |Route parsing and navigation behavior.      |
|`raw/asset/js/load.js`       |Runtime loading for managed websites.       |
|`raw/asset/js/vanilla.js`    |Shared browser utility functions.           |
|`raw/style/framework.js`     |Framework behavior used by the application. |
|`raw/asset/js/github.js`     |GitHub API integration.                     |
|`raw/asset/js/github.crud.js`|GitHub repository/content operations.       |
|`raw/asset/js/stripe.js`     |Stripe-related payment integration.         |

File responsibilities may evolve as the dashboard and website runtimes are consolidated.

Data model

domPad uses repository files as the persistence layer for managed website data. Application code references JSON resources for site configuration and collections such as:

• Site manifest and application metadata
• Blog posts
• Media library indexes, including audio, photos, and video
• Product catalog
• Payment configuration

Examples of paths used by the application include:

/site.webmanifest
/raw/posts/posts.json
/raw/media/media.json
/raw/media/audio/audio.json
/raw/media/photo/photo.json
/raw/media/video/video.json
/raw/merch/catalog.json
/raw/asset/json/stripe.json

These paths describe data files expected in managed website repositories; they are not necessarily all present in the domPad dashboard repository itself.

GitHub is used to read and write repository content. This makes the repository the source of truth for the managed site’s files and structured data.

Hosting and deployment

The dashboard repository is connected to Cloudflare Pages, with the main branch configured for continuous deployment. Changes pushed to that branch are deployed by the hosting integration.

The exact Cloudflare Pages build command, output-directory setting, environment variables, and other dashboard-side deployment settings are not documented in this repository.

Managed websites can also be deployed as static sites. GitHub Pages and custom-domain workflows are represented in the dashboard’s configuration and deployment features.

Development notes

Current architecture

• The dashboard currently loads its JavaScript through script tags in index.html.
• Dashboard MVC responsibilities are currently separated across mvc.m.js, mvc.v.js, and mvc.c.js.
• Managed websites currently use a separate mvc.js.
• The dashboard and website runtime share or reuse supporting browser utilities and routing/framework code where appropriate.

Planned architecture

The intended consolidation is:

1. Use one shared mvc.js for both the dashboard and managed websites.
2. Move environment-specific or application-specific JavaScript into framework.js.
3. Continue developing and debugging the application as the shared architecture evolves.

This is the planned direction, not a description of a completed refactor.

Development status

domPad is under active development. The dashboard modules, website runtime, shared framework, and external integrations may all be subject to ongoing debugging, refinement, and architectural changes. The module descriptions above explain their intended responsibilities; they should not be read as a guarantee that every workflow is finalized.

External services

The application integrates with external services for key capabilities:

• GitHub — authentication and repository-backed content management.
• Cloudflare Pages — dashboard hosting and continuous deployment.
• Cloudflare Workers — supporting endpoints used by application workflows.
• Stripe — payment and checkout functionality.

Credentials, tokens, and environment-specific configuration should be managed securely and should not be committed to the repository.

Contributing and changes

This README documents the repository’s current high-level structure and the intended direction of the architecture. Before changing shared runtime files, consider whether the behavior is used by the dashboard, managed websites, or both.

When investigating or modifying the application, distinguish between:

• Current — behavior implemented in the repository today.
• Planned — intended future architecture or functionality.
• Incomplete — work that is still under development.

This distinction is especially important while the dashboard and website MVC implementations are being brought toward a shared architecture.
