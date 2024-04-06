import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Editor, Toolbar, Validators, schema, toHTML } from 'ngx-editor';
import { isMarkActive } from 'ngx-editor/helpers';
import {
  EditorState,
  Plugin,
  PluginKey,
  PluginView,
  Transaction,
} from 'prosemirror-state';
import { toggleMark } from 'prosemirror-commands';

import { DatabaseService } from 'src/app/services/database/database.service';
import { EditorView } from 'prosemirror-view';
import { validColorValidator } from 'ngx-colors';

@Component({
  selector: 'app-new-post-dialog',
  templateUrl: './new-post-dialog.component.html',
  styleUrls: ['./new-post-dialog.component.scss'],
})
export class NewPostDialogComponent implements OnInit, OnDestroy {
  clearTextColor() {
    this.editor.commands.removeTextColor();
    this.updateTextColor(this.editor.view, this.editor.view.state);
    this.form.controls['textColor'].setValue('#000000');
    this.isTextColorActive = false;
  }
  clearBgColor() {
    this.editor.commands.removeBackgroundColor();
    this.updateBgTextColor(this.editor.view, this.editor.view.state);
    this.form.controls['bgColor'].setValue('#FFFFFF');
    this.isTextBGColorActive = false;
  }
  editor: Editor;
  html: '';
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  isTextColorActive = true;
  isTextColorDisabled = false;

  isTextBGColorActive = false;
  isTextBGColorDisabled = false;

  colors: string[] = [
    '#b60205',
    '#d93f0b',
    '#fbca04',
    '#0e8a16',
    '#006b75',
    '#1d76db',
    '#0052cc',
    '#5319e7',
    '#e99695',
    '#f9d0c4',
    '#fef2c0',
    '#c2e0c6',
    '#bfdadc',
    '#c5def5',
    '#bfd4f2',
    '#d4c5f9',
  ];
  selectedColor: string = '';

  onTextColorClick(e: MouseEvent): void {
    e.preventDefault();
    const { state, dispatch } = this.editor.view;
    this.executeTextColor(state, dispatch);
  }

  onTextBgColorClick(e: MouseEvent): void {
    e.preventDefault();
    const { state, dispatch } = this.editor.view;
    this.executeBgColor(state, dispatch);
  }

  executeTextColor(
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
  ): boolean {
    const { schema } = state;

    console.log(schema);

    if (this.isTextColorActive) {
      return toggleMark(schema.marks.text_color)(state, dispatch);
    }

    return toggleMark(schema.marks.text_color)(state, dispatch);
  }

  executeBgColor(
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
  ): boolean {
    const { schema } = state;

    console.log(schema);

    if (this.isTextColorActive) {
      return toggleMark(schema.marks.text_background_color)(state, dispatch);
    }

    return toggleMark(schema.marks.text_background_color)(state, dispatch);
  }

  updateTextColor: (view: EditorView, prevState: EditorState) => void = (
    view,
    prevState,
  ) => {
    this.isTextColorActive = isMarkActive(prevState, schema.marks.text_color);
    this.isTextColorDisabled = !this.executeTextColor(prevState, undefined); // returns true if executable
  };

  updateBgTextColor: (view: EditorView, prevState: EditorState) => void = (
    view,
    prevState,
  ) => {
    this.isTextBGColorActive = isMarkActive(
      prevState,
      schema.marks.text_background_color,
    );
    this.isTextBGColorDisabled = !this.executeBgColor(prevState, undefined); // returns true if executable
  };

  constructor(
    private dbService: DatabaseService,
    private dialogRef: MatDialogRef<NewPostDialogComponent>,
  ) {}

  form = new FormGroup({
    title: new FormControl(null, [Validators.required()]),
    editorContent: new FormControl(null, [Validators.required()]),
    textColor: new FormControl('#FFFFFF', {
      updateOn: 'change',
      validators: [validColorValidator],
    }),
    bgColor: new FormControl('#FFFFFF', {
      updateOn: 'change',
      validators: [validColorValidator],
    }),
  });

  ngOnInit(): void {
    this.editor = new Editor();

    this.dialogRef.updateSize('85vw', '80vh');

    this.form.get('textColor')?.valueChanges.subscribe((color) => {
      console.log(color);
      this.selectedColor = color!;
      this.editor.commands.textColor(this.selectedColor).exec();
      console.log(this.editor.view);
      this.updateTextColor(this.editor.view, this.editor.view.state);
      this.colors.push(this.selectedColor);
    });

    this.form.get('bgColor')?.valueChanges.subscribe((color) => {
      console.log(color);
      this.editor.commands.backgroundColor(color!).exec();
      console.log(this.editor.view);
      this.updateBgTextColor(this.editor.view, this.editor.view.state);
      this.colors.push(color!);
    });

    // let menuPlugin = MenuPlugin([
    //   {
    //     command: toggleMark(schema.marks.text_color),
    //     dom: document.getElementById('color-picker')!,
    //   },
    // ]);

    const textColorPickerPlugin = new Plugin({
      key: new PluginKey(`custom-menu-text-color-picker`),
      view: (view: EditorView) => {
        return { update: this.updateTextColor(view, view.state) } as PluginView;
      },
    });

    const bgColorPickerPlugin = new Plugin({
      key: new PluginKey(`custom-menu-text-color-picker`),
      view: (view: EditorView) => {
        return {
          update: this.updateBgTextColor(view, view.state),
        } as PluginView;
      },
    });

    this.editor.registerPlugin(bgColorPickerPlugin);
    this.editor.registerPlugin(textColorPickerPlugin);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  createPost() {
    console.log('post');
    this.dbService
      .createPost({
        location: 'Main',
        type: 'text',
        status: 'pending',
        title: this.form.get('title')?.value,
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        content: toHTML(this.form.get('editorContent')?.value!).replace(
          '\\',
          '',
        ),
      })
      .subscribe((val) => console.log(val));
  }
}
