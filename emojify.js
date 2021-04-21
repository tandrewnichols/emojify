import { clipboard, whisper } from 'loop-development-kit/ldk/goja/dist';
import { WhisperComponentType } from 'loop-development-kit/ldk/goja/dist/whisper';
import emojis from './emojis';

(function main() {
  const keys = Object.keys(emojis).flatMap((key) => [key, key.replace(/_/g, ' ')]).join('|');
  const regex = new RegExp(`(${ keys })`, 'ig');

  whisper.whisper.create({
    label: 'Emojify Started',
    components: [{
      id: '1',
      type: WhisperComponentType.Markdown,
      body: 'Listening for emojis in disguise'
    }]
  });

  try {
    clipboard.clipboard.listen(false, (err, text) => {
      if (!err && typeof text === 'string' && text.length) {
        const hasEmojis = regex.test(text);

        if (hasEmojis) {
          const whisperText = text.replace(regex, (key) => {
            return String.fromCodePoint(emojis[key.replace(/ /g, '_')]);
          });

          whisper.whisper.create({
            label: 'Emojify',
            components: [{
              id: '1',
              type: WhisperComponentType.Markdown,
              body: whisperText
            }]
          });
        }
      }
    });
  } catch (e) {
    console.log('Something went wrong listening for clipboard entries');
  }
})();
