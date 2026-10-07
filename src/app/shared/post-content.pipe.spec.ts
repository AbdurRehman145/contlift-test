import { PostContentPipe } from './post-content.pipe';

describe('PostContentPipe', () => {
  const pipe = new PostContentPipe();

  it('renders Markdown bodies to HTML', () => {
    const html = pipe.transform({ content: '## Title\n\nSome **bold** text', contentType: 'markdown' });
    expect(html).toContain('<h2>Title</h2>');
    expect(html).toContain('<strong>bold</strong>');
  });

  it('passes HTML bodies through even when labelled as Markdown', () => {
    const body = '<div>\n    <p>Indented HTML is not a code block</p>\n</div>';
    expect(pipe.transform({ content: body, contentType: 'markdown' })).toBe(body);
  });

  it('passes content through when contentType is html', () => {
    expect(pipe.transform({ content: 'plain', contentType: 'html' })).toBe('plain');
  });
});
