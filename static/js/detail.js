(function(){
  const input = document.querySelector('#post_input');
  const postBtn = document.querySelector('#post_btn');
  const wrapper = document.querySelector('#comments_wrapper');
  const getComments = async () => {
    const data = await fetch(`get-comments?forId=${articleId}`, {
      method: 'GET',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
    })
    const comments = (await data.json()).comments;
    const str = comments.map(v => {
      return `<li class="item"><span class="name">${v.author.slice(0, 20)}: </span><span>${v.content}</span></li>`
    }).join('');
    wrapper.innerHTML = str;
  }
  getComments();
  console.log('pos btn', postBtn)
  let sending = false;
  postBtn.onclick = async () => {
    if (sending || !input.value.trim()) {
      return;
    }
    sending = true;
    const val = input.value.trim();
    await fetch('post-comment', {
      method: 'POST',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        forId: articleId,
        content: val,
        author: navigator.platform,
      }),

    })
    input.value = '';
    await getComments();
    sending = false;
  }
})();
