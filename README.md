# Jason Stack — Research Website

A static, responsive research portfolio prepared for GitHub Pages.

![Website preview](assets/site-preview.png)

It includes:

- the supplied profile portrait beside the name in the homepage introduction;
- a randomized `G(3,3,4)` Fuss parking-function model based on the outer/inner-block construction in Figure 12(b), with color-coded nodes and individual block-label numbers, and neutral block hulls;
- a two-paragraph introduction and a linked advisor name;
- selected publications: two published articles, two preprints, and one ongoing project;
- downloadable BibTeX;
- a footer CV button opening the supplied PDF in a new tab;
- a live embedded `G(d,1,n)` noncrossing multichain visualizer;
- email, affiliation, and LinkedIn contact links, plus a GitHub repository link;
- light and dark themes, responsive navigation, publication filters, and copyable citations.

## Deploy on GitHub Pages

### Option A: personal site

1. Create a public repository named `<your-github-username>.github.io`.
2. Copy **the contents of this folder** into the repository root.
3. Commit and push to the `main` branch.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select `main` and `/ (root)`, then save.

The site will be available at `https://<your-github-username>.github.io/` after GitHub finishes the deployment.

### Option B: project site

The same files also work in an ordinary repository. Enable Pages from the repository's `main` branch and root directory. All internal links are relative, so the site can be served from a subdirectory such as `https://<username>.github.io/<repository>/`.

## Preview locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/` in a browser. A local server is recommended because the home page embeds the visualizer in an iframe.

## Files

```text
.
├── .nojekyll
├── index.html
├── publications.bib
├── README.md
├── site.webmanifest
├── assets/
│   ├── LinkedInProfPic.png
│   ├── favicon.svg
│   ├── site-preview.png
│   ├── site.js
│   └── styles.css
└── projects/
    ├── Gd1n_noncrossing_visualizer_withaction.html
    ├── gap3-parking-functions.html
    └── k-noncrossing-parking.gap
```

## Personal details to review before publishing

The website currently uses the public academic information associated with the supplied papers:

- **Name:** Jason Stack
- **Affiliation:** Mathematical Sciences, The University of Texas at Dallas
- **Email:** `jcs220002@utdallas.edu`

Update these in `index.html` if needed. The name appears in the page title, hero, structured metadata, contact section, and footer. The introduction, advisor link, LinkedIn profile, and GitHub repository link use the details supplied by Jason. No additional education history, awards, or teaching record have been added.

## Updating the portrait

The homepage portrait is `assets/LinkedInProfPic.png`. It is the supplied image, unaltered.
To change it, replace that file or update the `<img class="hero-portrait">` in `index.html`.
The `.hero-identity` and `.hero-portrait` rules in `assets/styles.css` control its placement
and responsive size; both parts of the name use the same heading style.

## Updating publications

Publication cards are in the `#publications` section of `index.html`. Citation text used by the “Copy citation” buttons is stored near the top of `assets/site.js`. BibTeX entries are in `publications.bib`.

The new preprint is **Posh Parking Spaces**, Jason Stack and Nathan Williams, arXiv:2610.07280 (2026). Its metadata and brief summary were checked against https://arxiv.org/abs/2610.07280.

**Positive Parking Spaces for Shephard Groups** is displayed as ongoing work to be submitted, not as an arXiv preprint or a published article. No author list, abstract, date, or paper link has been invented for it; a BibTeX entry can be added when those details are available.

The footer's **Papers** link goes to the publication section. The publication toolbar still offers the bibliography as a BibTeX download.

## Updating interactive models

The GAP3 feature (terminal preview and research-code description) has been removed from the homepage. The original GAP3 source and notes remain in `projects/` to preserve the uploaded research files, but neither is linked from the homepage. The HTML visualizer is unchanged.

- Replace `projects/Gd1n_noncrossing_visualizer_withaction.html` to update the live browser demo.
- Replace `projects/k-noncrossing-parking.gap` to update the downloadable GAP3 source.
- The full source displayed on `projects/gap3-parking-functions.html` is embedded in that page, so regenerate or replace that block when the GAP file changes.

## Notes

- No framework, package manager, or build step is required.
- The site uses system fonts and contains no analytics or third-party scripts.
- `.nojekyll` prevents GitHub Pages from applying Jekyll processing.

## Revision 5

- Replaced the introduction with the supplied two paragraphs and linked Nathan Williams.
- Removed the word "random" from the visible model subtitle, linked the model heading to the parking-spaces paper, and removed the node-color key.
- Removed the research-program and selected-experience sections, including their navigation links.
- Consolidated the heading as "Selected publications" beneath "Publications & preprints".
- Added the new arXiv preprint and a separate in-progress project, including an "In progress" filter.
- Replaced the software introduction, removed the GAP3 homepage feature, and simplified the contact heading.
- Added LinkedIn and GitHub links; the footer "Papers" link now opens the publication section.

For a deployed copy, replace the changed files in their existing locations. No files need to be deleted to remove the old sections from the homepage.


## Revision 6

- Removed the "Computational mathematics" item beneath the homepage buttons.
- Renamed the visible "Software", "Explore software", and "Research software" wording to "Interactive models", including navigation on the archived GAP3 page.
- Gave "View publications" and "Interactive models" the same primary-button style, width, and arrow icon.
- Kept only the first sentence in the annular model caption.
- Removed the displayed ell prefixes from the block labels. Each numeric block label now has its own color class, and node-number labels use the corresponding node colors. Block outlines and fills stay neutral.
- Replaced the interactive-model description with the supplied wording.
- Removed the redundant project label, large visualizer title, and introductory paragraph beside/below the embedded model. All three bullets and the demo/download controls remain.
- Linked "Theorem 4.8" to https://arxiv.org/abs/2502.01970, the parking-spaces paper used elsewhere on this page. The public v1 uses "Example 4.8" rather than the three-case positive Kreweras theorem; the existing theorem wording is retained as requested and may refer to a newer or separate draft. No unverified theorem-specific anchor has been added.

The original `#software` section identifier is preserved so existing bookmarks and links still work; all visible section and navigation wording is "Interactive models".
The embedded visualizer, its calculations, and the homepage model-generation algorithm are otherwise unchanged. Label color is passed individually to the renderer; it is not inferred from the block stroke.

## Revision 7

- Changed the final visualization bullet to "Invariant checks and a three-case action", removing its Theorem 4.8 reference and link.
- Added "This model relates to my work with parking spaces and positive parking spaces." at the end of the Interactive models description.
- Linked "parking spaces" to the 2025 Parking Spaces for Complex Reflection Groups entry (`#parking-spaces`).
- Linked "positive parking spaces" to the ongoing Positive Parking Spaces for Shephard Groups entry (`#positive-parking-spaces`).
- These links reveal their target entry if a publication filter has hidden it, and preserve keyboard navigation.

To apply revision 7 to revision 6, replace `index.html`, `assets/site.js`, and `README.md`.
The visualization code and site styling are unchanged.


## Revision 8: CV button

- Added a CV button beside Papers in the footer, using the existing primary-button style.
- The button opens `assets/CV_Base.pdf` in a new tab. The PDF is the supplied attachment, unchanged.
- To replace the CV later, upload the new PDF at the same path.
- For this update, replace `index.html`, `assets/styles.css`, and `README.md`, and add `assets/CV_Base.pdf`.
- The separate self-contained HTML review preview includes the CV as well; it is not needed for deployment.
