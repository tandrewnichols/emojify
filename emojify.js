import { clipboard, whisper } from "@oliveai/ldk";
import emojis from "./emojis";

(function main() {
  const keys = Object.keys(emojis)
    .flatMap((key) => {
      key = key.replace(/\+/g, "\\+").replace(/\-/g, "\\-");
      return [`\\b${key}\\b`, `\\b${key.replace(/_/g, " ")}\\b`];
    })
    .join("|");
  const regex = new RegExp(`(${keys})`, "ig");

  whisper.create({
    label: "Emojify Started",
    components: [
      {
        id: "1",
        type: whisper.WhisperComponentType.Markdown,
        body: "Listening for emojis in disguise",
      },
    ],
    onClose: () => console.log("Whisper closed"),
  });

  try {
    clipboard.listen(true, (text) => {
      if (typeof text === "string" && text.length) {
        const hasEmojis = regex.test(text);

        if (hasEmojis) {
          const whisperText = text.replace(regex, (key) => {
            try {
              let emoji = key.replace(/ /g, "_");
              let codepoint = emojis[emoji];

              if (codepoint instanceof Array) {
                codepoint = codepoint.join("");
              }

              if (codepoint) {
                return String.fromCodePoint(codepoint).toString();
              } else {
                return key;
              }
            } catch (e) {
              console.log(e);
              return key;
            }
          });

          whisper.create({
            label: "Emojify",
            components: [
              {
                id: "1",
                type: whisper.WhisperComponentType.Markdown,
                body: whisperText,
              },
            ],
            onClose: () => console.log("Whisper closed"),
          });
        }
      }
    });
  } catch (e) {
    console.log("Something went wrong listening for clipboard entries");
  }
})();
