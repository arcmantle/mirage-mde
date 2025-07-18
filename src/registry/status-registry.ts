import { wordCount } from '@arcmantle/library/string';
import { type stringliteral } from '@arcmantle/library/types';
import { type EditorView, type ViewUpdate } from '@codemirror/view';

import { type MirageMDE } from '../mirage-mde.js';


export interface StatusBarItem {
	value?:       string;
	name:         string;
	template:     (item: StatusBarItem, editor: EditorView, scope: MirageMDE) => string;
	css?:         (item: StatusBarItem, editor: EditorView, scope: MirageMDE) => string;
	initialize?:  (item: StatusBarItem, update: ViewUpdate, scope: MirageMDE) => void;
	onUpdate?:    (item: StatusBarItem, update: ViewUpdate, scope: MirageMDE) => void;
	onAnyUpdate?: (item: StatusBarItem, update: ViewUpdate, scope: MirageMDE) => void;
	onActivity?:  (item: StatusBarItem, update: ViewUpdate, scope: MirageMDE) => void;
}


export type BuildInStatus = [
	'words',
	'lines',
	'cursor',
	'autosave',
	'upload-image',
][number];


export const defaultStatus: BuildInStatus[] = [
	'words',
	'lines',
	'cursor',
];


export const builtInStatuses: [stringliteral, StatusBarItem][] = [
	[
		'words', {
			name:     'words',
			template: (item) => `
			<div>
				words: ${ item.value ?? '' }
			</div>
			`,
			css: () => `
			`,
			initialize: (item, update): void => {
				item.value = String(wordCount(update.state.doc.toString()));
			},
			onUpdate: (item, update): void => {
				item.value = String(wordCount(update.state.doc.toString()));
			},
		} satisfies StatusBarItem,
	],
	[
		'lines', {
			name:     'lines',
			template: (item) => `
			<div>
				lines: ${ item.value ?? '' }
			</div>
			`,
			css: () => `
			`,
			initialize: (item, update) => {
				item.value = String(update.state.doc.lines);
			},
			onUpdate: (item, update) => {
				item.value = String(update.state.doc.lines);
			},
			onActivity: () => {
			},
		} satisfies StatusBarItem,
	],
	[
		'cursor', {
			name:     'cursor',
			template: (item) => `
			<div>
				${ item.value ?? '' }
			</div>
			`,
			css:        () => ``,
			initialize: (item, update) => {
				const { state, state: { selection } } = update;
				const pos = selection.main.to;
				const posLine = state.doc.lineAt(pos);
				const posColumn = pos - posLine.from;

				item.value = `${ posLine.number }:${ posColumn }`;
			},
			onActivity: (item, update) => {
				const { state, state: { selection } } = update;
				const pos = selection.main.to;
				const posLine = state.doc.lineAt(pos);
				const posColumn = pos - posLine.from;

				item.value = `${ posLine.number }:${ posColumn }`;
			},
		} satisfies StatusBarItem,
	],
	[
		'autosave', {
			name:     'autosave',
			template: (item) => `
			<div>
				${ item.value ?? '' }
			</div>
			`,
			onAnyUpdate: (item, _update, scope) => {
				item.value = scope.lastSaved;
			},
		} satisfies StatusBarItem,
	],
	[
		'upload-image', {
			name:     'upload-image',
			template: (item) => `
			<div>
				${ item.value ?? '' }
			</div>
			`,
			initialize: (item, _update, scope) => {
				item.value = scope.options.imageTexts?.sbInit ?? '';
			},
		} satisfies StatusBarItem,
	],
];
