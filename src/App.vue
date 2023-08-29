<template>
	<div class="editor-container">
		<BubbleMenu
		v-if="editor"
		:editor="editor"
		:tippy-options="{ duration: 100 }"
		>
			<button
			@click="editor.chain().focus().setTextAlign('left').run()"
			:class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
			>
				left
			</button>
			<button
			@click="editor.chain().focus().setTextAlign('center').run()"
			:class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
			>
				center
			</button>
			<button
			@click="editor.chain().focus().setTextAlign('right').run()"
			:class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
			>
				right
			</button>
			<button
			@click="editor.chain().focus().setTextAlign('justify').run()"
			:class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
			>
				justify
			</button>

			<br>

			<button
			@click="editor.chain().focus().toggleBold().run()"
			:class="{ 'is-active': editor.isActive('bold') }"
			>
				<strong>B</strong>
			</button>
			<button
			@click="editor.chain().focus().toggleItalic().run()"
			:class="{ 'is-active': editor.isActive('italic') }"
			>
				<i>i</i>
			</button>
			<button
			@click="editor.chain().focus().toggleStrike().run()"
			:class="{ 'is-active': editor.isActive('strike') }"
			>
				<s>S</s>
			</button>
			<button
			@click="editor.chain().focus().toggleUnderline().run()"
			:class="{ 'is-active': editor.isActive('underline') }"
			>
				<u>u</u>
			</button>
			<button
			@click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
			:class="{ 'is-active': editor.isActive('heading', {level:2}) }"
			>
				H2
			</button>
			<button
			@click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
			:class="{ 'is-active': editor.isActive('heading', {level:3}) }"
			>
				H3
			</button>

			<br>

			<button
			@click="editor.chain().focus().toggleBulletList().run()"
			:class="{ 'is-active': editor.isActive('bulletList') }"
			>
				bullet
			</button>
			<button
			@click="editor.chain().focus().toggleOrderedList().run()"
			:class="{ 'is-active': editor.isActive('orderedList') }"
			>
				ordered
			</button>
		</BubbleMenu>

		<EditorContent :editor="editor" class="editor" />

		<button
		@click="download"
		class="dl-btn"
		>
			Download Docx
		</button>
	</div>
</template>

<script setup>
import { BubbleMenu, Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import FileSaver from 'file-saver'
import { Packer, Document } from 'docx'
import exportDoc from './exportDoc'
import exampleContent from './assets/example-content.json'

const editor = new Editor({
	content: exampleContent,
	extensions: [
		Underline,
		StarterKit.configure({
			heading: {
				levels: [1, 2, 3],
			},
		}),
		Typography.configure({
			openDoubleQuote: false,
			closeDoubleQuote: false,
			openSingleQuote: false,
			closeSingleQuote: false,
		}),
		TextAlign.configure({
			types: ['heading', 'paragraph', 'blockquote'],
		}),
	]
})

async function download() {
	console.log(editor.getJSON())
	const doc = new Document({
		creator: 'The Author',
		title: 'Doc Title',
		description: 'Descriptive text',
		sections: [{
			children: exportDoc(editor.getJSON())
		}],
		compatibility: {
			doNotExpandShiftReturn: true,
		},
	})

	const blob = await Packer.toBlob(doc)
	FileSaver.saveAs(blob, 'tiptap-json-doc ' + Date.now() + '.docx')
}
</script>

<style>
.editor-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 700px
}

.editor,
.tiptap {
	width: 100%;
	height: 100%;
	min-height: 100px;
}

.tiptap {
	border: 2px solid gray;
	border-radius: 4px;
	padding: 4px;
}

.ProseMirror p {
	text-align: left;
	font-size: 1rem;
	line-height: 1.2;
	margin-block-start: 0;
    margin-block-end: 0;
}

button.is-active {
	background-color: rgb(51, 52, 53) !important
}

.dl-btn  {
	margin-top: 10px;
}
</style>