import { Paragraph, TextRun, HeadingLevel, AlignmentType, ShadingType, PageBreak } from 'docx'

const TIPTAP_TYPES = {
	Blockquote: 'blockquote',
	BulletList: 'bulletList',
	CodeBlock: 'codeBlock',
	HardBreak: 'hardBreak',
	Heading: 'heading',
	HorizontalRule: 'horizontalRule',
	ListItem: 'listItem',
	OrderedList: 'orderedList',
	Paragraph: 'paragraph',
	Text: 'text',
}
const TXT_ALIGN_L = 'left'

export const defaultMarks:any = {
	italic() {
		return { italics: true }
	},
	bold() {
		return { bold: true }
	},
	code() {
		return {
			font: {
				name: 'Monospace',
			},
			color: '000000',
			shading: {
				type: ShadingType.SOLID,
				color: 'D2D3D2',
				fill: 'D2D3D2',
			},
		}
	},
	subscript() {
		return { subScript: true }
	},
	superscript() {
		return { superScript: true }
	},
	strike() {
		return { strike: true }
	},
	underline() {
		return {
			underline: {},
		}
	},
	smallcaps() {
		return { smallCaps: true }
	},
	allcaps() {
		return { allCaps: true }
	},
}

function parseMarks(marks) {
	const styles = {}
	for (let i = 0; i < marks.length; i++) {
		const m = marks[i]
		Object.assign(styles, defaultMarks[m.type]())
	}
	return styles
}

function parseContent(content) {
	const children:any[] = []
	for (let i = 0; i < content.length; i++) {
		const node = content[i]
		switch (node.type) {
			case TIPTAP_TYPES.BulletList:
				console.log(node)
				break
			case TIPTAP_TYPES.OrderedList:
				break
			case TIPTAP_TYPES.ListItem:
				break
			case TIPTAP_TYPES.HardBreak:
				children.push(new Paragraph({
					children: [new PageBreak()]
				}))
				break
			case TIPTAP_TYPES.Paragraph:
				const p:any = {}
				if (node.content) p.children = parseContent(node.content)
				if (node.attrs.textAlign === TXT_ALIGN_L) p.alignment = AlignmentType.JUSTIFIED
				children.push(new Paragraph(p))
				break
			case TIPTAP_TYPES.Text:
				const t = {
					text: node.text
				}
				if (node.marks) {
					const styles = parseMarks(node.marks)
					Object.assign(t, styles)
				}
				children.push(new TextRun(t))
				break
		}
	}
	return children
}

// creates a docx section child (an array) of Paragraphs
// @param doc   the tiptap json doc that holds the content
export default function exportDoc(doc) {
    const content = doc.content
	const children:any[] = []
	for (let i = 0; i < content.length; i++) {
		const node:any = content[i]
		switch (node.type) {
			case TIPTAP_TYPES.BulletList:
				console.log(node)
				break
			case TIPTAP_TYPES.OrderedList:
				break
			case TIPTAP_TYPES.HardBreak:
				children.push(new Paragraph({
					children: [new PageBreak()]
				}))
				break
			case TIPTAP_TYPES.Heading:
				const paraOpts:any = {
					heading: HeadingLevel.HEADING_1,
				}
				if (node.attrs.level === 2) paraOpts.heading = HeadingLevel.HEADING_2
				else if (node.attrs.level === 3) paraOpts.heading = HeadingLevel.HEADING_3
				if (node.content) paraOpts.text = parseContent(node.content)
				children.push(new Paragraph(paraOpts))
				break
			case TIPTAP_TYPES.Paragraph:
				const p:any = {}
				if (node.content) p.children = parseContent(node.content)
				if (node.attrs.textAlign === TXT_ALIGN_L) p.alignment = AlignmentType.JUSTIFIED
				children.push(new Paragraph(p))
				break
			}
	}
	return children
}