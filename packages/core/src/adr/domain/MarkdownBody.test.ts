import { FilesystemPath } from "./FilesystemPath";
import { MarkdownBody } from "./MarkdownBody";

describe("MarkdownBody", () => {
  describe("getFirstH1Title()", () => {
    it("returns the first H1 title", () => {
      const body = new MarkdownBody(
        `# First title
Lorem ipsum
## Subtitle
## Subtitle
# Second title`
      );
      expect(body.getFirstH1Title()).toEqual("First title");
    });

    it("returns undefined when there is no first title", () => {
      const body = new MarkdownBody(
        `Lorem ipsum
## Subtitle
## Subtitle`
      );
      expect(body.getFirstH1Title()).toBeUndefined();
    });
  });

  describe("setFirstH1Title()", () => {
    it("replaces the existing one", () => {
      const body = new MarkdownBody(
        `# First title
Lorem ipsum
## Subtitle
## Subtitle
# Second title`
      );
      body.setFirstH1Title("New title");
      expect(body.getRawMarkdown()).toEqual(`# New title
Lorem ipsum
## Subtitle
## Subtitle
# Second title`);
    });

    it("creates one if needed", () => {
      const body = new MarkdownBody(
        `Lorem ipsum
## Subtitle
## Subtitle`
      );
      body.setFirstH1Title("New title");
      expect(body.getRawMarkdown()).toEqual(`# New title
Lorem ipsum
## Subtitle
## Subtitle`);
    });
  });

  describe("getHeaderMetadata()", () => {
    it("returns a metadata", () => {
      const body = new MarkdownBody(
        `# Hello World

- Lorem Ipsum
- Status: draft
-  DATE :   2020-01-01

Technical Story: [description | ticket/issue URL] <!-- optional -->
## Subtitle
## Subtitle
# Second title`
      );
      expect(body.getHeaderMetadata("status")).toEqual("draft");
      expect(body.getHeaderMetadata("date")).toEqual("2020-01-01");
    });

    it("returns a metadata even if there is a paragraph before", () => {
      const body = new MarkdownBody(
        `# Hello World
Hello!

- Lorem Ipsum
- Status: draft
-  DATE :   2020-01-01

Technical Story: [description | ticket/issue URL] <!-- optional -->
## Subtitle
## Subtitle
# Second title`
      );
      expect(body.getHeaderMetadata("status")).toEqual("draft");
      expect(body.getHeaderMetadata("date")).toEqual("2020-01-01");
    });

    it("returns undefined when the metadata is not set", () => {
      const body = new MarkdownBody(
        `# Hello World
Hello!

- Lorem Ipsum
- Status: draft
-  DATE :   2020-01-01

Technical Story: [description | ticket/issue URL] <!-- optional -->
## Subtitle
## Subtitle
# Second title`
      );
      expect(body.getHeaderMetadata("Deciders")).toBeUndefined();
    });
  });

  describe("setHeaderMetadata()", () => {
    it("modifies an already existing metadata", () => {
      const body = new MarkdownBody(
        `# Hello World
Hello!

- Lorem Ipsum
- Status: draft
-  DATE :   2020-01-01

Technical Story: [description | ticket/issue URL] <!-- optional -->
## Subtitle
## Subtitle
# Second title`
      );

      body.setHeaderMetadata("Status", "accepted");

      expect(body.getRawMarkdown()).toEqual(`# Hello World
Hello!

- Lorem Ipsum
- Status: accepted
-  DATE :   2020-01-01

Technical Story: [description | ticket/issue URL] <!-- optional -->
## Subtitle
## Subtitle
# Second title`);
    });

    it("creates a metadata", () => {
      const body = new MarkdownBody(
        `# Hello World
Hello!

- Lorem Ipsum
- Status: draft
-  DATE :   2020-01-01

Technical Story: [description | ticket/issue URL] <!-- optional -->
## Subtitle
## Subtitle
# Second title`
      );

      body.setHeaderMetadata("Deciders", "@JohnDoe");

      expect(body.getRawMarkdown()).toEqual(`# Hello World
Hello!

- Lorem Ipsum
- Status: draft
-  DATE :   2020-01-01
- Deciders: @JohnDoe

Technical Story: [description | ticket/issue URL] <!-- optional -->
## Subtitle
## Subtitle
# Second title`);
    });

    it("creates a metadata even if the paragraph does not exist", () => {
      const body = new MarkdownBody(
        `# Hello World

## Subtitle
## Subtitle
# Second title`
      );

      body.setHeaderMetadata("Deciders", "@JohnDoe");

      expect(body.getRawMarkdown()).toEqual(`# Hello World

- Deciders: @JohnDoe


## Subtitle
## Subtitle
# Second title`);
    });
  });

  describe("getlinks()", () => {
    it("returns links", () => {
      const body = new MarkdownBody(
        `# Hello World
## Subtitle

- test

## Subtitle
## Links

- link1: [foo](bar.md)
- link2`
      );
      expect(body.getLinks()).toEqual(["link1: [foo](bar.md)", "link2"]);
    });

    it("returns undefined when no links", () => {
      const body = new MarkdownBody(
        `# Hello World
## Subtitle

- test

## Subtitle`
      );
      expect(body.getLinks()).toBeUndefined();
    });
  });

  describe("addLink()", () => {
    it("adds a link", () => {
      const body = new MarkdownBody(
        `# Hello World
## Subtitle
## Links

- link1: [foo](bar.md)
- link2

`
      ); // TODO: fix this whitespace issue

      body.addLink("link3");

      expect(body.getRawMarkdown()).toEqual(`# Hello World
## Subtitle
## Links

- link1: [foo](bar.md)
- link2
- link3

`);
    });

    it("adds a link even if the paragraph does not exist", () => {
      const body = new MarkdownBody(
        `# Hello World
## Subtitle
Lorem ipsum`
      ); // TODO: fix this whitespace issue

      body.addLink("link1");

      expect(body.getRawMarkdown()).toEqual(`# Hello World
## Subtitle
Lorem ipsum

## Links

- link1

`);
    });
  });

  describe("addLinkNoDuplicate()", () => {
    it("does not add the link if there is a duplicate", () => {
      const body = new MarkdownBody(
        `# Hello World
## Subtitle
## Links

- link test

`
      ); // TODO: fix this whitespace issue

      body.addLinkNoDuplicate("Link TEST");
      body.addLinkNoDuplicate("Link2");

      expect(body.getRawMarkdown()).toEqual(`# Hello World
## Subtitle
## Links

- link test
- Link2

`);
    });
  });

  describe("replaceLocalImages()", () => {
    const myBasePath = new FilesystemPath("/root", "path/to/adrs");

    it("replaces a simple image", () => {
      const body = new MarkdownBody("![](test.png)").setMyBasePath(myBasePath);
      body.replaceLocalImages();
      expect(body.getRawMarkdown()).toEqual(
        '<LocalImage pathFromCwd="path/to/adrs/test.png" alt="" />'
      );
    });

    it("replaces an image with an alt", () => {
      const body = new MarkdownBody(
        '![This is a "test" !](test.png)'
      ).setMyBasePath(myBasePath);
      body.replaceLocalImages();
      expect(body.getRawMarkdown()).toEqual(
        '<LocalImage pathFromCwd="path/to/adrs/test.png" alt="This is a &quot;test&quot; !" />'
      );
    });

    it("does not replace a remote image", () => {
      const body = new MarkdownBody(
        "![](https://test.com/test.png)"
      ).setMyBasePath(myBasePath);
      body.replaceLocalImages();
      expect(body.getRawMarkdown()).toEqual("![](https://test.com/test.png)");
    });

    it("replaces an image up to the Log4brains workdir", () => {
      const body = new MarkdownBody("![](../../../test.png)").setMyBasePath(
        myBasePath
      );
      body.replaceLocalImages();
      expect(body.getRawMarkdown()).toEqual(
        '<LocalImage pathFromCwd="test.png" alt="" />'
      );
    });

    it("does not replace an image outisde of the Log4brains workdir", () => {
      const body = new MarkdownBody("![](../../../../test.png)").setMyBasePath(
        myBasePath
      );
      body.replaceLocalImages();
      expect(body.getRawMarkdown()).toEqual("![](../../../../test.png)");
    });

    it("replaces an image with a link", () => {
      const body = new MarkdownBody(
        "[![This is a test!](test.png)](https://test.com/)"
      ).setMyBasePath(myBasePath);
      body.replaceLocalImages();
      expect(body.getRawMarkdown()).toEqual(
        '[<LocalImage pathFromCwd="path/to/adrs/test.png" alt="This is a test!" />](https://test.com/)'
      );
    });
  });

  describe("getLocalImagesRelativePaths()", () => {
    const myBasePath = new FilesystemPath("/root", "path/to/adrs");

    it("retreives the local images relative paths", () => {
      const body = new MarkdownBody(`# Test

- ![](test.png)
- Duplicate: ![](test.png)
- Duplicate with alt: ![This is a "test" !](test.png)
- ![Foo](test/bar.png)
- ![](https://test.com/test.png)
- ![](../../../subimage.png)
- ![](../../../../image-outside-of-scope.png)

`).setMyBasePath(myBasePath);
      expect(body.getLocalImagesPaths()).toEqual([
        myBasePath.join("test.png"),
        myBasePath.join("test/bar.png"),
        myBasePath.join("../../../subimage.png")
      ]);
    });
  });
});
