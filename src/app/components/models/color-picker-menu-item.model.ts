import { Command } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Plugin } from 'prosemirror-state';
import { setBlockType } from 'prosemirror-commands';
import { schema } from 'ngx-editor';

interface MenuItem {
  command: Command;
  dom: HTMLElement;
}

class MenuView {
  items: MenuItem[];
  editorView: EditorView;
  dom: HTMLDivElement;

  constructor(items: MenuItem[], editorView: EditorView) {
    this.items = items;
    this.editorView = editorView;

    this.dom = document.createElement('div');
    this.dom.className = 'menubar';
    items.forEach(({ dom }) => this.dom.appendChild(dom));
    this.update();

    this.dom.addEventListener(
      'mousedown',
      (e: { preventDefault: () => void; target: any }) => {
        e.preventDefault();
        editorView.focus();
        items.forEach(({ command, dom }) => {
          if (dom.contains(e.target))
            command(editorView.state, editorView.dispatch, editorView);
        });
      },
    );
  }

  update() {
    this.items.forEach(({ command, dom }) => {
      const active = command(this.editorView.state, undefined, this.editorView);
      dom.style.display = active ? '' : 'none';
    });
  }

  destroy() {
    this.dom.remove();
  }
}

export function MenuPlugin(items: MenuItem[]) {
  return new Plugin({
    view(editorView: EditorView) {
      console.log(editorView);
      const menuView = new MenuView(items, editorView);
      editorView.dom.parentNode!.insertBefore(menuView.dom, editorView.dom);
      return menuView;
    },
  });
}

// Helper function to create menu icons
function icon(text: string | null, name: string) {
  const span = document.createElement('span');
  span.className = 'menuicon ' + name;
  span.title = name;
  span.textContent = text;
  return span;
}

// export function componentIcon(name: string) {
//   let span = document.createElement('span');
//   let component = document.getElementById(name);
//   span.className = 'menuicon ' + name;
//     span.title = name;

//   span.
//   return span;
// }

// Create an icon for a heading at the given level
// function heading(level: string | number) {
//   return {
//     command: setBlockType(schema.nodes.heading, { level }),
//     dom: icon('H' + level, 'heading'),
//   };
// }
