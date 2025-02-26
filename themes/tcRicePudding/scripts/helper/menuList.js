const recursionTreeData = (categories, topNode) => {
    if (!Array.isArray(topNode.children)) {
        topNode.children = [];
    }

    categories.forEach(el => {
        if (el.parent === topNode._id && !topNode.children.includes(el)) {
            topNode.children.push(el);
            recursionTreeData(categories, el);
        }
    });
};

const generoatePostsDom = (posts)=>{
    let res = [`<ul class="cus-category-list-posts">`];

    posts.forEach(post => {
        res.push(`
            <li class="cus-category-list-posts-item" data-post-name="${post.title}">
                <a href="/weblog/${ post.path }" id="${ post.title.replaceAll(' ','-') }">${ post.title }</a> 
            </li>
        `);
    });

    res.push('</ul>');
    return res.join('');
};

const generoateTreeDom = (topNodeList, isRoot = true) => {
    let res = [`<ul class="${isRoot ? 'cus-category-list' : 'cus-category-list-child'}">`];

    topNodeList.forEach(it => {
        res.push(`
            <li class="cus-category-list-item">
                <span class="cus-category-list-link">${it.name}</span>
                <span class="cus-category-list-count">${it.posts.length}</span>
            </li>
            ${it.children.length > 0 ? generoateTreeDom(it.children, false) : generoatePostsDom(it.posts)}
        `);
    });

    res.push('</ul>');
    return res.join('');
};

hexo.extend.helper.register("menu_list", function (site = {}) {
    let topNodeList = site.categories.filter(it => !Reflect.has(it, 'parent'));
    let childNodeList = site.categories.filter(it => Reflect.has(it, 'parent'));

    topNodeList.forEach(topNode => {
        recursionTreeData(childNodeList, topNode);
    });

    return generoateTreeDom(topNodeList);
});
