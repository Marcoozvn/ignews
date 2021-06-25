import PrismicDOM from 'prismic-dom';
const Elements = PrismicDOM.RichText.Elements;

export function htmlSerializer(type, element, content, children) {
  switch(type) {

    case Elements.preformatted:
      const findLanguage = element.text.trim().match(/```\w+/g);

      if (findLanguage) {
        const language = findLanguage[0].substring(3);

        console.log('normal',children.join('').replace('```' + language, ''))
        console.log('trim', children.join('').replace('```' + language, '').trim())

        return `<pre><code class="language-${language}">` + children.join('').replace('```' + language, '').trim() + '</code></pre>';
      }

      return '<pre class="code">' + children.join('') + '</pre>';

    default:
      return null;
  }
};