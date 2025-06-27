import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageGalleryView } from "./ImageGallery";

export interface ImageGalleryOptions {
  // Opciones futuras para la galería
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageGallery: {
      /**
       * Insert an image gallery
       */
      setImageGallery: () => ReturnType
    }
  }
}

export const ImageGallery = Node.create<ImageGalleryOptions>({
  name: "imageGallery",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      images: {
        default: [],
      },
      id: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='image-gallery']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { images } = HTMLAttributes;
    
    return [
      "div",
      { 
        "data-type": "image-gallery",
        class: "image-gallery-render"
      },
      [
        "div",
        { class: "gallery-grid-render" },
        ...(images || []).map((src: string) => [
          "img",
          {
            src,
            alt: "",
            style: "width: 100%; height: auto; border-radius: 4px;"
          }
        ])
      ]
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageGalleryView);
  },

  addCommands() {
    return {
      setImageGallery:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              images: [],
              id: Date.now().toString()
            },
          });
        },
    };
  },
});

export default ImageGallery;