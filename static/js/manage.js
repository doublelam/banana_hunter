(function() {
  const titleInput = document.querySelector('#title_input');
  const contentInput = document.querySelector('#content_input');
  const tagInput = document.querySelector('#tag_input');
  const postBtn = document.querySelector('#post_btn');

  postBtn.onclick = async function() {
    const title = titleInput.value;
    const content = contentInput.value;
    const tag = tagInput.value;
    await fetch('/post-article', {
      method: 'POST',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        title,
        content,
        tags: tag.split(',')
      }),
    });
    console.log('___reset vals')
    titleInput.value = '';
    contentInput.value = '';
    tagInput.value = '';
  }

})()