window.github = {
    endpoint: "https://api.github.com",
    oauth: {
        authorize: async(params,sl)=>{
            var code = params.code;
            var state = params.state;
            var client_id = github.oauth.client_id[location.host];
            var redirect_uri = github.oauth.config.redirect_uri;
            var settings = {
                data: JSON.stringify({
                    client_id,
                    code,
                    redirect_uri,
                    state
                }),
                dataType: "POST"
            };
            var endpoint = "https://oauth.dompad.workers.dev";
            if (sl) {
                endpoint = "https://github.com/login/oauth/access_token";
                settings.mode = "cors";
            }
            var obj = {
                state
            }
            //var query = new URLSearchParams(obj).toString();
            //endpoint + "?" + query;
            console.log(509, "mvc.js", {
                endpoint,
                settings
            });
            try {
                var result = JSON.parse(await ajax(endpoint, settings));
                console.log(526, "mvc.js", {
                    result
                });
                var token = result.access_token;
                if (token) {
                    localStorage.setItem('githubAccessToken', token);
                }
            } catch (e) {
                console.log(e);
            }
        }
        ,
        client_id: {
            "100.115.92.14:8080": "8f48243dba09dd64030b",
            "dompad.io": "1a41e41b2b371e7a1a5b",
            "dompad.pages.dev": "fdeadaa98b35c6df688c",
            "dompad.github.tld": 0 < 1 ? "d100ccbc44112f0d5a92" : "Iv1.cbe275c17b8db02d"
        },
        config: {
            client_id: 0 < 1 ? "Iv1.cbe275c17b8db02d" : "d100ccbc44112f0d5a92",
            redirect_uri: window.location.protocol + "//" + window.location.host + "/dashboard",
            scope: "delete_repo,gist,user,public_repo,repo"
        },
        login: (target)=>{
            //var client_id = github.oauth.client_id[location.host];
            var client_id = "Iv1.cbe275c17b8db02d";
            var redirect_uri = github.oauth.config.redirect_uri;
            var search = route.search;

            var scope = github.oauth.config.scope;
            var state = 'github_' + Crypto.uid.create(1);
            var obj = {
                client_id,
                scope,
                state,
                redirect_uri
            }
            var query = new URLSearchParams(obj).toString();

            var a = document.createElement('a');
            var href = "https://github.com/login/oauth/authorize?" + query;
            a.href = href;
            a.click();
            console.log(534, "mvc.js", {
                href,
                obj,
                query
            });
        }
        ,
        logout: ()=>{
            localStorage.removeItem('githubAccessToken');
            dom.body.removeAttribute('data-uid');
        }
        ,
        verify: async()=>{
            var bool = true;
            var token = localStorage.githubAccessToken;

            if(token) {
                try {
                    await github.user.get();
                } catch(e) {
                    bool = false;
                }
            } else {
                bool = false;
            }

            console.log(bool);
            return bool;
        }
    },
    raw: {
        blob: async(params)=>{
            return new Promise((resolve,reject)=>{
                fetch("https://api.github.com/repos/" + params.owner + "/" + params.repo + "/contents" + params.resource, {
                    cache: "reload",
                    headers: {
                        Accept: "application/vnd.github.raw",
                        Authorization: "token " + localStorage.githubAccessToken
                    }
                }).then(async(response)=>{
                    if (response.status === 404) {
                        var res = await response.json();
                        var json = {
                            json: res,
                            error: new Error(response.status)
                        }
                        throw json;
                    } else {
                        return response.blob()
                    }
                }
                ).then((blob)=>{
                    resolve(URL.createObjectURL(blob));
                }
                ).catch((e)=>{
                    reject(e.json)
                }
                );
            }
            );
        }
        ,
        file: (resource)=>{
            return new Promise((resolve,reject)=>{
                var host = 'https://raw.dompad.workers.dev';
                var url = host + resource + '?token=' + localStorage.githubAccessToken;
                var settings = {
                    headers: {
                        'Accept': 'application/vnd.github.v3.raw',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': 'token ' + localStorage.githubAccessToken
                    },
                    mode: 'cors'
                };
                const a = (data)=>{
                    resolve(data);
                }
                ajax(url).then(a);
            }
            );
        }
        ,
        res: async(params)=>{
            return new Promise((resolve,reject)=>{
                fetch("https://api.github.com/repos/" + params.owner + "/" + params.repo + "/contents" + params.resource, {
                    cache: "reload",
                    headers: {
                        Accept: "application/vnd.github.raw",
                        Authorization: "token " + localStorage.githubAccessToken
                    }
                }).then(async(response)=>{
                    if (response.status === 404) {
                        var res = await response.json();
                        var json = {
                            json: res,
                            error: new Error(response.status)
                        }
                        throw json;
                    } else {
                        return response.text();
                    }
                }
                ).then((blob)=>{
                    resolve(URL.createObjectURL(blob));
                }
                ).catch((e)=>{
                    reject(e.json)
                }
                );
            }
            );
        }
        ,
        git: async(resource)=>{
            var r = rout.ed.dir(resource);
            var repo = r[1];
            r.splice(0, 3);
            var path = rout.ed.url(r);
            var user = await github.user.get();
            var owner = user.login;
            //console.log({owner, path, repo});
            return await github.repos.contents({
                owner,
                path,
                repo
            }, {
                accept: "application/vnd.github.raw",
                cache: "reload"
            });
        }
        ,
        path: async(resource)=>{
            var r = rout.ed.dir(resource);
            var repo = r[1];
            r.splice(0, 3);
            var path = rout.ed.url(r);
            var user = await github.user.get();
            var owner = user.login;
            //console.log({owner, path, repo});
            return await github.repos.contents({
                owner,
                path,
                repo
            }, {
                //accept: "application/vnd.github.raw",
                cache: "reload"
            });
        }
    },
    database: {
        blobs: (params,settings)=>{
            if (settings) {
                if (settings.dataType) {
                    if (settings.dataType === "POST") {
                        return new Promise((resolve,reject)=>{
                            const data = settings.data;
                            const encoding = params.encoding ? settings.encoding = params.encoding : null
                            const owner = params.owner;
                            const repo = params.repo;
                            const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/blobs";
                            const dataType = settings.dataType;
                            const a = (d)=>{
                                const data = JSON.parse(d);
                                resolve(data);
                            }
                            const b = (error)=>{
                                console.log(error);
                                reject(error);
                            }
                            const accessToken = localStorage.githubAccessToken;
                            accessToken ? settings.headers = {
                                Accept: "application/vnd.github+json",
                                Authorization: "token " + accessToken
                            } : null;
                            console.log(173, params, {
                                url,
                                settings
                            });
                            ajax(url, settings).then(a).catch(b);
                        });
                    }
                }
            } else {
                return new Promise((resolve,reject)=>{
                    const owner = params.owner;
                    const repo = params.repo;
                    const sha = params.sha;
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/blobs/" + sha;
                    const a = (d)=>{
                        const data = JSON.parse(d);
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    var settings = {};
                    accessToken ? settings.headers = {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    //console.log({ url, settings });
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }
        }
        ,
        commits: (params,settings)=>{
            if (settings && settings.dataType) {
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{
                        var message = params.message;
                        var owner = params.owner;
                        var repo = params.repo;
                        var sha = params.sha;
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/commits";
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
        ,
        references: (params,settings)=>{
            if (settings) {
                if (settings.dataType) {
                    if (settings.dataType === "GET") {
                        return new Promise((resolve,reject)=>{
                            var owner = params.owner;
                            var repo = params.repo;
                            var branch = params.branch;
                            var ref = branch ? "/heads/" + branch : params.ref;
                            const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/refs" + ref;
                            const dataType = settings.dataType;
                            const a = (d)=>{
                                const data = JSON.parse(d);
                                resolve(data);
                            }
                            const b = (error)=>{
                                console.log(error);
                                reject(error);
                            }
                            const accessToken = localStorage.githubAccessToken;
                            accessToken ? settings.headers = {
                                Accept: "application/vnd.github+json",
                                Authorization: "token " + accessToken
                            } : null;
                            ajax(url, settings).then(a).catch(b);
                        }
                        );
                    }
                    if (settings.dataType === "PATCH") {
                        return new Promise((resolve,reject)=>{
                            var owner = params.owner;
                            var repo = params.repo;
                            var branch = params.branch;
                            var ref = branch ? "/heads/" + branch : "";
                            const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/refs" + ref;
                            const dataType = settings.dataType;
                            const a = (d)=>{
                                const data = JSON.parse(d);
                                resolve(data);
                            }
                            const b = (error)=>{
                                console.log(error);
                                reject(error);
                            }
                            const accessToken = localStorage.githubAccessToken;
                            accessToken ? settings.headers = {
                                Accept: "application/vnd.github+json",
                                Authorization: "token " + accessToken
                            } : null;
                            ajax(url, settings).then(a).catch(b);
                        }
                        );
                    }
                }
            } else {
                return new Promise((resolve,reject)=>{
                    var owner = params.owner;
                    var repo = params.repo;
                    var branch = params.branch;
                    var ref = branch ? "/heads/" + branch : params.ref;
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/refs" + ref;
                    const a = (d)=>{
                        const data = JSON.parse(d);
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings = {
                        headers: {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        }
                    } : null;
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }

        }
        ,
        trees: (params,settings)=>{
            if (settings) {
                if (settings.dataType) {
                    if (settings.dataType === "GET") {
                        return new Promise((resolve,reject)=>{
                            var owner = params.owner;
                            var repo = params.repo;
                            var branch = params.branch;
                            var sha = params.sha;
                            const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/trees/" + sha;
                            const data = settings.data;
                            const dataType = settings.dataType;
                            const a = (d)=>{
                                const data = JSON.parse(d);
                                resolve(data);
                            }
                            const b = (error)=>{
                                console.log(error);
                                reject(error);
                            }
                            const accessToken = localStorage.githubAccessToken;
                            accessToken ? settings.headers = {
                                Accept: "application/vnd.github+json",
                                Authorization: "token " + accessToken
                            } : null;
                            ajax(url, settings).then(a).catch(b);
                        }
                        );
                    }
                    if (settings.dataType === "POST") {
                        return new Promise((resolve,reject)=>{
                            var owner = params.owner;
                            var repo = params.repo;
                            const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/trees";
                            const data = settings.data;
                            const dataType = settings.dataType;
                            const a = (d)=>{
                                const data = JSON.parse(d);
                                resolve(data);
                            }
                            const b = (error)=>{
                                console.log(error);
                                reject(error);
                            }
                            const accessToken = localStorage.githubAccessToken;
                            accessToken ? settings.headers = {
                                Accept: "application/vnd.github+json",
                                Authorization: "token " + accessToken
                            } : null;
                            ajax(url, settings).then(a).catch(b);
                        }
                        );
                    }
                }
            } else {
                return new Promise((resolve,reject)=>{
                    var owner = params.owner;
                    var repo = params.repo;
                    var branch = params.branch;
                    var sha = params.sha;
                    var recursive = params.recursive ? "?recursive=" + params.recursive : "";
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/trees/" + sha + recursive;
                    const a = (d)=>{
                        const data = JSON.parse(d);
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings = {
                        headers: {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        }
                    } : null;
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }
        }
    },
    gists: {
        create: (settings)=>{
            if (settings && settings.dataType) {
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{
                        const url = github.endpoint + "/gists";
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
        ,
        update: (params,settings)=>{
            if (settings && settings.dataType) {
                if (settings.dataType === "PATCH") {
                    return new Promise((resolve,reject)=>{
                        const url = github.endpoint + "/gists/" + params.gist;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
        ,
        delete: (params,settings)=>{
            if (settings && settings.dataType) {
                if (settings.dataType === "DELETE") {
                    return new Promise((resolve,reject)=>{
                        const url = github.endpoint + "/gists/" + params.gist;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
        ,
        get: (params,settings)=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/gists";
                const data = settings.data;
                const dataType = settings.dataType;
                const a = (d)=>{
                    const data = JSON.parse(d);
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
    },
    pages: {
        crud: function(params, settings) {
            console.log(586, params, settings);
            return new Promise((resolve,reject)=>{
                console.log(588, params, settings);
                const owner = params.owner;
                const repo = params.repo;
                const path = params.path;
                const url = github.endpoint + "/repos/" + owner + "/" + repo + "/pages";
                const a = (d)=>{
                    const data = d ? JSON.parse(d) : null;
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const accessToken = localStorage.githubAccessToken;
                settings = settings ? settings : {};
                accessToken ? settings.headers = {
                    Accept: settings && settings.accept ? settings.accept : "application/vnd.github+json",
                    Authorization: "token " + accessToken,
                    'If-None-Match': ''
                } : null;
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
    },
    repos: {
        contents: (params,settings)=>{
            //console.log(555, {params, settings});
            if (settings && settings.dataType) {
                if (settings.dataType === "DELETE") {
                    console.log(7, {
                        params,
                        settings
                    });
                    return new Promise((resolve,reject)=>{
                        const owner = params.owner;
                        const repo = params.repo;
                        const path = params.path;
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/contents/" + path;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: settings.accept ? settings.accept : "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                } else if (settings.dataType === "PUT") {
                    console.log(params);
                    return new Promise((resolve,reject)=>{
                        const owner = params.owner;
                        const repo = params.repo;
                        const path = params.path;
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/contents" + path;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken,
                            'If-None-Match': ''
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                } else {
                    return new Promise((resolve,reject)=>{
                        const owner = params.owner;
                        const repo = params.repo;
                        const path = params.path;
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/contents" + path;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: settings.accept ? settings.accept : "application/vnd.github+json",
                            Authorization: "token " + accessToken,
                            'If-None-Match': ''
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            } else {
                settings ? null : settings = {};
                return new Promise((resolve,reject)=>{
                    const owner = params.owner;
                    const repo = params.repo;
                    const path = params.path;
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/contents" + path;
                    0 > 1 ? console.log(695, {
                        url
                    }) : null;
                    const a = (d)=>{
                        const data = is.json(d) ? JSON.parse(d) : d;
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    settings.cache = "reload";
                    accessToken ? settings.headers = {
                        Accept: settings.accept ? settings.accept : "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }
        }
        ,
        create: (settings)=>{
            return new Promise((resolve,reject)=>{
                const a = (d)=>{
                    const data = JSON.parse(d);
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github.v3+json",
                    Authorization: "token " + accessToken
                } : null;
                const url = github.endpoint + "/user/repos";
                settings.dataType = "POST";
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
        ,
        user: (params, settings)=>{
            console.log(params, settings);
            var settings = settings ? settings : {};
            return new Promise((resolve,reject)=>{
                const query = params.query ? "?" + new URLSearchParams(params.query).toString() : "";
                console.log(query);
                const a = (d)=>{
                    const data = JSON.parse(d);
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github.v3+json",
                    Authorization: "token " + accessToken
                } : null;
                const url = github.endpoint + "/user/repos" + query;
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
        ,
        delete: async(params)=>{
            const owner = params.owner;
            const repo = params.repo;
            console.log({
                owner,
                repo
            });
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/repos/" + owner + "/" + repo;
                const dataType = "DELETE";
                const a = (d)=>{
                    console.log(d);
                    resolve(d);
                }
                const b = (error)=>{
                    console.log(error);
                    alert(error.message.message);
                    reject(error);
                }
                const settings = {
                    dataType
                };
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                console.log({
                    settings
                });
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
        ,
        dispatches: (params, settings) => {
            if (settings.dataType) {
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{
                        const owner = params["owner"];
                        const repo = params["repo"];
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/dispatches";
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }                
        },
        generate: (params,settings)=>{
            if (settings.dataType) {
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{
                        const template_owner = params["template_owner"];
                        const template_repo = params["template_repo"];
                        const url = github.endpoint + "/repos/" + template_owner + "/" + template_repo + "/generate";
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
        ,
        get: (params)=>{
            return new Promise((resolve,reject)=>{
                const owner = params.owner;
                const repo = params.repo;
                const url = github.endpoint + "/repos/" + owner + "/" + repo;
                const a = (d)=>{
                    const data = JSON.parse(d);
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings = {
                    headers: {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    }
                } : null;
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
        ,
        update: (params,settings)=>{
            return new Promise((resolve,reject)=>{
                const owner = params["owner"];
                const repo = params["repo"];
                const url = github.endpoint + "/repos/" + owner + "/" + repo;
                const data = settings.data;
                const dataType = settings.dataType;
                const a = (d)=>{
                    const data = JSON.parse(d);
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                console.log({
                    settings
                });
                ajax(url, settings).then(a).catch(b);
            }
            );

        }
    },
    search: {
        code: (query)=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/search/code?" + query;
                const a = (d)=>{
                    const data = JSON.parse(d);
                    console.log({
                        data
                    });
                    resolve(data.items);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const settings = {};
                settings.cache = "reload";
                settings.dataType = "PATCH";
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                console.log({
                    settings
                });
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
        ,
        repositories: (query)=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/search/repositories?" + query;
                const a = (d)=>{
                    const data = JSON.parse(d);
                    console.log({
                        data
                    });
                    resolve(data.items);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const settings = {};
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                console.log({
                    settings
                });
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
    },
    rate: {
        limit: ()=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/rate_limit";
                const a = (d)=>{
                    const data = JSON.parse(d);
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    //alert(error.message.message);
                    reject(error);
                }
                const settings = {};
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
    },
    user: {
        get: (params)=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/user";
                const a = (d)=>{
                    const data = JSON.parse(d);
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    //alert(error.message.message);
                    reject(error);
                }
                const settings = {};
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
        ,
        repos: (params,settings)=>{
            var params = params ? params : {};
            var settings = settings ? settings : {};
            console.log(params, settings);
            if (settings.dataType) {
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{   
                        const sort = params.sort;
                        const url = github.endpoint + "/users/" + username + "/repos" + params.query;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            console.log(766, {
                                d
                            });
                            resolve(d);
                        }
                        const b = (error)=>{
                            console.log(770, {
                                error
                            });
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log(777, {
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            } else {
                return new Promise((resolve,reject)=>{
                    console.log(params);
                    const query = params.query ? "?" + new URLSearchParams(params.query).toString() : "";
                    const url = github.endpoint + "/users/" + params.username + "/repos" + query;
                    const a = (d)=>{
                        const data = JSON.parse(d);
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    settings.cache = "reload";
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings.headers = {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    console.log(url, settings);
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }
        }
    },
    users: {

        get: (params)=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/users/" + params.username;
                const a = (d)=>{
                    const data = JSON.parse(d);
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    //alert(error.message.message);
                    reject(error);
                }
                const settings = {};
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                ajax(url, settings).then(a).catch(b);
            }
            );
        }

    }
}
