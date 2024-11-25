import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {
  Editor,
  Toolbar,
  Validators,
  schema,
  toHTML,
  NgxEditorModule,
} from 'ngx-editor';
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
import { validColorValidator, NgxColorsModule } from 'ngx-colors';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import {
  PostType,
  PostBase,
  AnyPost,
} from 'src/app/components/models/post.model';

@Component({
  selector: 'app-new-post-dialog',
  templateUrl: './new-post-dialog.component.html',
  styleUrls: ['./new-post-dialog.component.scss'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    NgxEditorModule,
    NgClass,
    NgxColorsModule,
    MatIconButton,
    MatIcon,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class NewPostDialogComponent implements OnInit, OnDestroy {
  private dbService = inject(DatabaseService);
  private dialogRef =
    inject<MatDialogRef<NewPostDialogComponent>>(MatDialogRef);
  private snack = inject(MatSnackBar);

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

  locationOptions = ['Main', 'Articles', 'Anime'];

  postTypeOptions = [
    { value: 'link', displayValue: 'Link Post' },
    { value: 'text', displayValue: 'Text Post' },
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
    feedLocation: new FormControl(null),
    postType: new FormControl(null),
  });

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

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

    this.editor.registerPlugin(textColorPickerPlugin);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

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

  createPost() {
    console.log('post');

    // Safely extract form values with fallbacks
    const title = this.form.get('title')?.value ?? '';
    const location = this.form.get('feedLocation')?.value ?? 'Main';
    const editorContent = this.form.get('editorContent')?.value ?? '';
    const postType = this.form.get('postType')?.value ?? 'text';

    // Map form value to PostType enum
    const mappedPostType =
      postType === 'text'
        ? PostType.TextPost
        : postType === 'link'
          ? PostType.LinkPost
          : postType === 'image'
            ? PostType.ImagePost
            : postType === 'video'
              ? PostType.VideoPost
              : PostType.TextPost;

    // Convert editor content using toHTML (ensure the correct type is passed)
    const content = toHTML(editorContent as unknown as Record<string, any>);

    // Generate the post payload dynamically
    let postPayload: AnyPost;

    if (mappedPostType === PostType.TextPost) {
      postPayload = {
        id: 0,
        type: PostType.TextPost,
        title_or_uri: title,
        content,
        location,
        status: 'pending',
      };
    } else if (mappedPostType === PostType.LinkPost) {
      postPayload = {
        id: 0,
        type: PostType.LinkPost,
        title_or_uri: this.form.get('uri')?.value ?? '',
        content,
        location,
        status: 'pending',
      };
    } else if (mappedPostType === PostType.ImagePost) {
      postPayload = {
        id: 0,
        type: PostType.ImagePost,
        image: this.form.get('image')?.value ?? '',
        content,
        location,
        title_or_uri: 'empty',
        status: 'pending',
      };
    } else if (mappedPostType === PostType.VideoPost) {
      postPayload = {
        id: 0,
        type: PostType.VideoPost,
        video: this.form.get('video')?.value ?? '',
        content,
        location,
        title_or_uri: 'empty',
        status: 'pending',
      };
    } else {
      throw new Error('Unsupported post type');
    }

    // Call the database service
    this.dbService.createPost(postPayload).subscribe({
      next: (val) => console.debug(val),
      error: (err) => {
        console.error(err);
        this.snack.open('Failed To Post, Try Again...', 'X');
      },
      complete: () => this.dialogRef.close('Cancel'),
    });
  }
}
