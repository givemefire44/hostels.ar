import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import GalleryWithControls from '../components/GalleryWithControls';

export interface GalleryOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    gallery: {
      /**
       * Add a gallery
       */
      setGallery: (options?: { images?: string[]; columns?: number }) => ReturnType;
    };
  }
}

export const Gallery = Node.create<GalleryOptions>({
  name: 'gallery',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'block',

  content: '',

  atom: true,

  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: element => {
          const images = element.getAttribute('data-images');
          return images ? JSON.parse(images) : [];
        },
        renderHTML: attributes => {
          return {
            'data-images': JSON.stringify(attributes.images),
          };
        },
      },
      columns: {
        default: 2,
        parseHTML: element => parseInt(element.getAttribute('data-columns') || '2'),
        renderHTML: attributes => {
          return {
            'data-columns': attributes.columns.toString(),
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="gallery"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { images = [], columns = 2 } = HTMLAttributes;
    
    // Create the gallery HTML structure for preview mode
    const galleryImages = Array.isArray(images) ? images : JSON.parse(images || '[]');
    
    const imageElements = galleryImages.map((src: string) => [
      'img',
      {
        src,
        alt: 'Imagen de galería',
      },
    ]);

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'gallery',
        'data-columns': columns.toString(),
      }),
      [
        'div',
        { class: 'gallery-grid' },
        ...imageElements,
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(GalleryWithControls);
  },

  addCommands() {
    return {
      setGallery:
        (options = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});

export default Gallery;