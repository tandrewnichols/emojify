import emojis from './emojis';

(function main() {
  const keys = Object.keys(emojis).flatMap((key) => [key, key.replace(/_/g, ' ')]).join('|');
  const regex = new RegExp(`(${ keys })`, 'ig');

  oliveHelps.whisper.markdown('Emojify', 'Listening for emojis in disguise');
  try {
    oliveHelps.clipboard.listen(function (err, text) {
      if (!err && typeof text === 'string' && text.length) {
        const hasEmojis = regex.test(text);

        if (hasEmojis) {
          const whisperText = text.replace(regex, (key) => {
            return String.fromCodePoint(emojis[key.replace(/ /g, '_')]);
          });

          oliveHelps.whisper.markdown('Emojify', whisperText);
        }
      }
    });
  } catch (e) {
    console.log('Something went wrong listening for clipboard entries');
  }
})();
