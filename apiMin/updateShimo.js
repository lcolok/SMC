var AV=require("leanengine"),filename=__filename.split("/").pop().split(".js").shift();AV.Cloud.define(filename,e=>updateShimo(e));var axios=require("axios");const Qs=require("qs");var fs=require("fs"),request=require("request"),newDiscussionID="K8CWmBMqMtYYpU1f",getAttachmentID="K8CWmBMqMtYYpU1f",shimoCookie=process.env.shimoCookie,genericHeaders={Accept:"application/vnd.shimo.v2+json","Accept-Encoding":"br, gzip, deflate","Accept-Language":"zh-cn",Authorization:"Bearer 62cbbe058449d3db514c7aece09afe0c13d0e501ed07624478704405d6cef617200823a164c086b87153edbba7acabcbc78c475c53a19a89df10cc2f872855a8","Cache-Control":"no-cache",Connection:"keep-alive","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16B92",Cookie:shimoCookie};async function tryCatch(e){try{return[await e,null]}catch(e){return[null,e]}}function http(e){return tryCatch(axios.create({transformRequest:[e=>Qs.stringify(e)]})(e))}function KB2GB(e){return(e/1073741824).toFixed(2)}async function getDiscussion(e){var t,a=[],i={Accept:"*/*","Accept-Encoding":"br, gzip, deflate","Accept-Language":"zh-cn",Connection:"keep-alive",Referer:"https://shimo.im/docs/K8CWmBMqMtYYpU1f","User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.1 Safari/605.1.15","X-CSRF-Token":"JDvV3azC-fmyRaI4kR98csJiXEhmprm78WMw",Cookie:shimoCookie+"_csrf=q4MNRquXrxATGBLCwExHVcIs;"};const[n,s]=await http({method:"get",url:`https://shimo.im/smapi/files/${e}/discussions?limit=99999999`,headers:i});if(!s){for(var o in t=n.data.data.list){var r=t[o];a.push(r.data.content)}return a}}async function getAttachment(e){var t="https://api.shimo.im/files/"+e+"?content=true";const[a,i]=await http({method:"get",url:t,headers:genericHeaders});if(!i){var n=[],s=a.data.content;s=JSON.parse(s);for(var o=0;o<s.length;o++){var r=s[o][1].attachment;r&&n.push(r)}return n}}async function postDiscussion(e,t){const[a,i]=await http({method:"post",url:"https://shimo.im/smapi/files/"+e+"/discussions",headers:{Cookie:shimoCookie},data:{content:t}});if(!i)return 0!==a.data.code?"error":a.data}async function shortenURL(e){var t=e.match(/[a-zA-z]+:\/\/[^\s]*/g);for(i=0;i<t.length;i++){var a="http://api.weibo.com/2/short_url/shorten.json?source=2849184197&url_long="+encodeURIComponent(t[i]),n=(await axios.get(a)).data.urls[0].url_short;e=e.replace(t[i],n)}return e}function cutHTTP(e){return e.replace(/[a-zA-z]+:\/\//g,"")}async function googleTranslateByPost(e){try{var t,a=await axios({method:"POST",url:"http://translate.google.cn/translate_a/single",params:{dt:"t",q:e,tl:"zh-CN",ie:"UTF-8",sl:"auto",client:"ia",dj:"1"},headers:{Accept:"*/*","Accept-Encoding":"br, gzip, deflate","Accept-Language":"zh-cn",Connection:"keep-alive",Cookie:"NID=154=Vf6msfWVov9Icm1WMYfq3dQ3BGHUlq6Txh5RHjnBtN48ZIZAdE_iQjxrrOMsOhbRlXXHtReYEm1rRKGUD3WsP1DhA0sO0nDf5S-J69qEBYRzIAY8nd1cE20wAKOr3cXxxPgwN12Dc5ly07v-F7RY-6Uv3ldkWGYeXWTgwkPR6Cs",Host:"translate.google.cn","User-Agent":"GoogleTranslate/5.26.59113 (iPhone; iOS 12.1; zh_CN; iPhone10,3)"}}),i="",n=a.data.sentences;if(n.length>1)for(t=0;t<n.length;++t)i+=n[t].trans+"\n";else i=n[0].trans;return i}catch(t){return e}}function emoji(e){return e.match(/[a-zA-Z]/g)?e.match(/mp4|mov|avi/gi)?"🎬":e.match(/webm|mkv|avi/gi)?"▶️":e.match(/mp3|ogg|wav|flac|ape|alca|aac/gi)?"🎵":e.match(/zip|7z|rar/gi)?"📦":e.match(/dmg|iso/gi)?"💽":e.match(/ai|psd|aep/gi)?"📐":e.match(/ppt|pptx|key/gi)?"📽️":e.match(/ttf|otf/gi)?"🔤️":e.match(/doc|pdf/gi)?"️📄":"❓":e}async function update(e,t){var a,i,n=[],s=await getDiscussion(e);s.length;for(var o in i=await getAttachment(t),a=0!=s.length?s.join("\n"):"",s)s[o].match("size")&&Number(JSON.parse(s[o]).size);i.forEach(async e=>{var t=e,i=t.name.split("."),s=i.pop(),o=i.join(".");if(!a.match(t.url)){var r={type:s,name:o,size:t.size,uploaderURL:t.url},c=await save2DataBase(r);n.push(c)}});n.length;return n}async function save2DataBase(e){e.shortURL=await shortenURL(e.uploaderURL),e.name_trans=await googleTranslateByPost(e.name.toLowerCase()),content=JSON.stringify(e);var t=await postDiscussion(newDiscussionID,content);return e.id=t.data.id,e.unixus=t.data.unixus,AV.Cloud.run("save2LeanCloud",e),`${emoji(e.type)} ${e.name} | ${cutHTTP(e.shortURL)}`}async function updateShimo(e){var t;if(e&&0==e.params.code){var a=e.params.data,i=e.params.class||"ShimoBed",n={type:a.type,name:a.name,size:a.size,uploaderURL:a.url,lottieURL:e.params.lottieURL,chosenClass:i};save2DataBase(n),t=[n]}else t=await update(newDiscussionID,getAttachmentID);return t}