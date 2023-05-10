import axios from 'axios';

export const gtranslate = async function (text) {
  const res = await axios.post(
    `https://translation.googleapis.com/language/translate/v2?key=AIzaSyDuAyFJ_399-M_wduyA_Lqor7-n3BXhU0o`,
    { q: text, target: 'sv' }
  );

  const translation = res.data.data.translations[0].translatedText;

  return translation;
};
