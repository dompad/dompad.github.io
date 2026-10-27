window.github.crud = {};
window.github.crud.create = async(event)=>{
    var row = [];
    event.preventDefault();
    var form = event.target;
    var value = form.find('[type="text"]').value;
    //alert(value);

    if (0 < 1 && value.length > 0) {
        const user = await github.user.get();
        const fix = value.toLowerCase();
        const filename = "page." + fix.split(' ').join('-') + ".html";

        const message = "Add " + value + " to Posts";
        const content = "";

        var rte = rout.ed.dir(route.path);
        rte.splice(0, 4);

        event.target.closest('form').find('[type="submit"]').removeAttribute('disabled');
        event.target.closest('form').find('[data-submit]').classList.remove('opacity-50pct');

        var page = (rte.length > 0 ? "/" : "") + rte.join('/') + "/" + fix.split(' ').join('-') + "/";
        var path = (rte.length > 0 ? "/" : "") + rte.join('/') + "/" + fix.split(' ').join('-') + "/";
        var row = {
            slug: value.replaceAll(' ', '-').replaceAll(/[\u0250-\ue007]/g, '').replaceAll(/\W/g, "").toLowerCase(),
            title: value
        };
        var sha = null;

        try {
            var data = await github.repos.contents({
                owner: user.login,
                repo: GET[1],
                path: "/raw/posts/posts.json"
            });
            var sha = data.sha;
            var j = JSON.parse(atob(data.content));
            var json = JSON.parse(atob(data.content));
            json.push(row);
        } catch (e) {
            var j = [];
            var json = [row];
        }
        rows = Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
        var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
        var str = JSON.stringify(rows, null, 4);

        inc ? alert("This item already exists.") : github.repos.contents({
            owner: user.login,
            repo: GET[1],
            path: "/raw/posts/posts.json"
        }, {
            data: JSON.stringify({
                content: btoa(unescape(encodeURIComponent(str))),
                message,
                sha
            }),
            dataType: "PUT"
        }).then(()=>{
            "/dashboard/:get/posts/".router()
            event.target.closest('form').find('[type="submit"]').setAttribute('disabled', true);
            event.target.closest('form').find('[data-submit]').classList.add('opacity-50pct');
        }
        ).catch(e=>{
            console.log(e);
            0 > 1 ? "/dashboard/:get/merch/".router().then(modal.alert({
                body: "There was an error creating this page.",
                submit: "OK",
                title: "Error"
            })) : null;
        }
        );

    }
}
window.github.crud.read = ()=>{}
window.github.crud.push = async(params,array)=>{
    console.log(2466, 'controller.posts.update', "variables", {
        params,
        array
    });
    alert(1218);
    var user = await github.user.get();
    var message = params.message;
    var owner = params.owner;
    var repo = params.repo;

    //REFERENCES
    var references = await github.database.references({
        branch: "main",
        owner,
        repo
    }).then((data)=>{
        return data;
    }
    );
    var sha = references.object.sha;
    console.log(2466, 'controller.posts.update', "references", {
        references,
        sha
    });
    alert(1238);

    //TREE
    var tree = [];
    console.log(1241, {array});
    if (array.length > 0) {
        var b = 0;
        do {
            var row = array[b];
            console.log(1245, {row});
            if (row.content) {
                var res = await github.database.blobs({
                    owner,
                    repo
                }, {
                    data: JSON.stringify({
                        content: row.content,
                        encoding: row.hasOwnProperty('type') ? row.type : "utf-8"
                    }),
                    dataType: "POST"
                }).catch(error=>{
                    console.log(2504, 'github.database.blobs', error, row);
                }
                );
            }
            console.log(1076, row);
            tree[b] = {
                content: row.content,
                path: row.path,
                mode: "100644",
                type: "blob",
                sha: res && res.sha ? res.sha : ""
            };
            b++;
        } while (b < array.length)
    }
    console.log(2517, 'controller.posts.update', "tree", {
        tree
    });

    //TREES GET
    var trees = await github.database.trees({
        owner,
        path: "/raw/merch",
        recursive: true,
        repo,
        sha: references.object.sha
    }).catch(error=>{
        console.log(2530, 'GET github.database.trees', error);
    }
    );
    var rt = trees.tree;
    var tr = trees.tree;
    console.log(1122, 'controller.posts.update', "GET trees", {
        rt,
        tr
    });
    if (tr.length > 0) {
        var t = 0;
        do {
            var tt = 0;
            var trt = tr[t];
            do {
                var trx = tree[tt];
                var dir = rout.ed.dir(trx.path);
                var ttt = 0;
                do {
                    var d = rout.ed.dir(trx.path)[ttt];
                    var dd = rout.ed.dir(trx.path).splice(0, ttt + 1);
                    var ddu = rout.ed.url(dd).replace(/^\/|\/$/g, '');
                    var dp = rout.ed.dir(ddu);
                    tr = tr.filter(row=>{
                        var rp = rout.ed.dir(row.path);
                        var here = ddu.startsWith(row.path) && rp.has(dp);
                        return !here;
                    }
                    )
                    0 > 1 ? console.log(t, tt, ttt, {
                        ddu,
                        trt: trt.path,
                        trx: trx.path
                    }, {
                        trt
                    }) : null;
                    ttt++;
                } while (ttt < dir.length);
                tt++;
            } while (tt < tree.length);
            t++;
        } while (t < tr.length)
    }
    tree = tr.concat(tree);
    var treef = [];
    //console.log(1180, tree);
    if (tree.length > 0) {
        tree.sort((a,b)=>a.path.localeCompare(b.path));
        //console.log(1183, tree);
        //var del = tree.filter(row=>row.content === null)
        var t = 0;
        do {
            var trt = tree[t];
            if ("content"in trt && trt.content === null) {
                treef.push(trt.path);
                //console.log(1191, t, treef, trt.path);
            }
            //0 > 1 || trt.content === null ? console.log(1167, t, trt) : null;
            if ("content"in trt && trt.content === null) {
                var tp = rout.ed.dir(trt.path);
                0 > 1 ? console.log(1161, t, row.path, trt.path, {
                    tp
                }, {
                    row,
                    trt,
                    treet: tree[t]
                }) : null;
                //0 < 1 ? console.log(1198, row) : null;
                tree.forEach(row=>{
                    var rp = rout.ed.dir(row.path);
                    var here = row.path.startsWith(trt.path)
                    // && rp.has(tp);
                    //0 < 1 ? console.log(1177, trt.path) : null;
                    if (row.content === null || here) {
                        0 > 1 ? console.log(1177, rp.has(tp), {
                            rp,
                            tp
                        }, row, trt.path) : null;
                        0 > 1 ? tree = tree.filter(r=>{
                            if (row.path === r.path) {//console.log(row.path, r.path);
                            }
                            return row.path !== r.path;
                        }
                        ) : null;
                    }
                    //return !here
                    //return !row.path.startsWith(trt.path) && !rout.ed.dir(row.path).has(tp)
                }
                )
                //tree = tree.filter(row=>(!row.path === trt.path))
                //tree = tree.filter(row=>(!row.path.startsWith(trt.path)))
                //tree = tree.filter(row=>(!rout.ed.dir(row.path).has(tp)))
            }
            t++;
        } while (t < tree.length);
    }
    var i = 0;
    //console.log(1227, treef);
    var treex = [];
    0 < 1 ? treef.forEach(r=>{
        var tp = rout.ed.dir(r);
        tree.filter(row=>{
            var rp = rout.ed.dir(row.path);
            //console.log(1238, tp, row.path);
            if (rp.has(tp)) {
                console.log(1240, i, row);
                treex.push(row.path);
                //delete row.content;
                //return row;
            } else {//console.log(1243, i, row);
            //return !rp.has(tp);
            //return row;
            }
            i++;
        }
        )
    }
    ) : null;
    var treen = tree.filter((el)=>{
        delete el.content;
        //console.log(1256, treex.includes(el.path), treex, el, el.path);
        return !treex.includes(el.path)
    }
    )
    tree = treen;
    console.log(1227, {
        tree,
        treef,
        treex,
        treen
    });
    var diff = {
        deleted: rt.filter(function(obj) {
            return !tree.some(function(el) {
                return el.path === obj.path
            })
        }).filter(function(el) {
            return el.type === "blob"
        }),
        removed: rt.filter(function(obj) {
            return !tree.some(function(el) {
                return el.path === obj.path
            })
        }),
        keep: rt.filter(function(obj) {
            return tree.some(function(el) {
                return el.path === obj.path
            })
        })
    };
    console.log(2533, 'controller.posts.update', "GET trees", {
        diff,
        trees: trees.tree,
        tree,
        rt,
        tr
    });

    //TREES POST
    if (0 < 1) {
        var trees = await github.database.trees({
            owner,
            repo
        }, {
            data: JSON.stringify({
                "tree": tree
            }),
            dataType: "POST"
        }).catch(error=>{
            console.log(2530, 'POST github.database.trees', error);
        }
        );
        console.log(2537, 'controller.posts.update', "POST trees", {
            trees
        });
    }

    //COMMIT
    if (0 < 1) {
        var commits = await github.database.commits({
            owner,
            repo
        }, {
            data: JSON.stringify({
                "message": message,
                "parents": [references.object.sha],
                "tree": trees.sha
            }),
            dataType: "POST"
        }).catch(error=>{
            console.log(2530, 'POST github.database.commits', error);
        }
        );
        console.log(2575, 'controller.posts.commits', {
            commits
        });
    }

    //REFERENCES
    if (0 < 1) {
        var refs = await github.database.references({
            branch: "main",
            owner,
            repo
        }, {
            data: JSON.stringify({
                force: true,
                sha: commits.sha
            }),
            dataType: "PATCH"
        });
        //var sha = refs.object.sha;
        console.log("references", {
            refs
        });

        return refs;
    }

}
window.github.crud.delete = ()=>{}
