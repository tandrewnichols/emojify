import { clipboard, whisper } from "@oliveai/ldk";
import { WhisperComponentType } from "@oliveai/ldk/dist/whisper";
import emojis from './emojis';

(function main() {
  const keys = Object.keys(emojis).flatMap((key) => {
    key = key.replace(/\+/g, '\\+').replace(/\-/g, '\\-');
    return [key, key.replace(/_/g, ' ')]
  }).join('|');
  const regex = new RegExp(`(${ keys })`, 'ig');

  whisper.whisper.create({
    label: 'Emojify Started',
    components: [{
      id: '1',
      type: WhisperComponentType.Markdown,
      body: 'Listening for emojis in disguise'
    }],
    onClose: () => console.log('Whisper closed')
  });

  try {
    clipboard.clipboard.listen(true, (text) => {
      if (typeof text === 'string' && text.length) {
        const hasEmojis = regex.test(text);

        if (hasEmojis) {
          const whisperText = text.split(' ').map((word) => {
            word = word.replace(/ /g, '_');

            if (emojis[word]) {
              return String.fromCodePoint(emojis[word]);
            } else {
              return word;
            }
          }).join(' ');

          whisper.whisper.create({
            label: 'Emojify',
            components: [{
              id: '1',
              type: WhisperComponentType.Markdown,
              body: whisperText
            }],
            onClose: () => console.log('Whisper closed')
          });
        }
      }
    });
  } catch (e) {
    console.log('Something went wrong listening for clipboard entries');
  }
})();
