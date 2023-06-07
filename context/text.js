 export default function googleTranslateElementInit(){

    new window.google.translate.TranslateElement({ pageLanguage:'en', includedLanguages: 'en,es,pt',autoDisplay: false,multilanguagePage: true,
     layout:window.google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
 
   

};

// $(document).ready(function(){
//   $('#google_translate_element').bind('DOMNodeInserted', function(event) {
//     $('.goog-te-menu-value span:first').html('LANGUAGE');
//     $('.goog-te-menu-frame.skiptranslate').load(function(){
//       setTimeout(function(){
//         $('.goog-te-menu-frame.skiptranslate').contents().find('.goog-te-menu2-item-selected .text').html('LANGUAGE');
//       }, 100);
//     });
//   });
// });

// import React, { useEffect } from "react";
// const GoogleTranslate = () => {
//   const googleTranslateElementInit = () => {
//     new window.google.translate.TranslateElement(
//       {
//         pageLanguage: "en",
//         autoDisplay: false,
//       },
//       "google_translate_element"
//     );
//   };
//   useEffect(() => {
//     var addScript = document.createElement("script");
//     addScript.setAttribute(
//       "src",
//       "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
//     );
//     document.body.appendChild(addScript);
//     window.googleTranslateElementInit = googleTranslateElementInit;
//   }, []);
//   return (
//     <div>
//       <div id="google_translate_element"></div>
// <p>dd</p>
//     </div>
//   );
// };

// export default GoogleTranslate;
