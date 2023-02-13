///////////////
// Execution //
///////////////

let whoAmI = null;
fetchWhoAmI().then(() => {
    page_home();
});


////////////////////
// Page Switching //
////////////////////

function hideContent() {
    displayElements(['loginDiv', 'registerDiv', 'usersDiv', 'userInfoDiv', 'userMessagesDiv', 'userFeedDiv', 'userFollowersDiv', 'userNewMessageDiv'], 'none');
}

function hideNav() {
    displayElements(['navFeed', 'navAccount', 'navLogin', 'navRegister', 'navHome'], 'none');
}

function prepare_page() {
    hideContent();
    hideNav();
    upd_helloH2();
    if (whoAmI) { // logged
        displayElements(['navFeed', 'navAccount', 'navHome']);
    } else {
        displayElements(['navLogin', 'navRegister', 'navHome']);
    }
}

function page_home() {
    prepare_page();
    displayElement("usersDiv");
    upd_usersDiv();
}
function page_login() {
    prepare_page();
    displayElement("loginDiv");
}
function page_register() {
    prepare_page();
    displayElement("registerDiv");
}
function page_feed() {
    prepare_page();
    displayElement("userFeedDiv");
    upd_userFeedDiv();
}
function page_userInfo(userId) {
    prepare_page();
    displayElements(['userInfoDiv', 'userMessagesDiv', 'userFollowersDiv']);
    upd_userFollowersDiv(userId);
    upd_userInfoDiv(userId);
    upd_userMessagesDiv(userId);

    displayElement('followUser', 'inline');
    displayElement('userNewMessageDiv', 'none');

    if (whoAmI && whoAmI.userId === userId) {
        displayElement('followUser', 'none');
        displayElement('userNewMessageDiv');
    } 
    if (!whoAmI) { // if not logged
        displayElement('followUser', 'none');
    }
}

function displayElement(elemId, display = 'flex') {
    document.querySelector(`#${elemId}`).style.display = display;
}
function displayElements(elemIds, display = 'flex') {
    elemIds.forEach(elemId => {
        displayElement(elemId, display);
    });
}

async function fetchWhoAmI() {
    await fetch('/api/social/whoami')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                return;
            }
            whoAmI = data;
        });
}

function upd_helloH2() {
    if (whoAmI) {
        const helloH2 = document.querySelector('#helloH2');
        helloH2.innerHTML = `Hello ${whoAmI.username}!`;
    }
}


/////////////////////
// Event Listeners //
/////////////////////

document.querySelector('#navLogin').addEventListener('click', (event) => page_login());
document.querySelector('#navHome').addEventListener('click', (event) => page_home());
document.querySelector('#socialAppHome').addEventListener('click', (event) => page_home());
document.querySelector('#navRegister').addEventListener('click', (event) => page_register());
document.querySelector('#navFeed').addEventListener('click', (event) => page_feed());
document.querySelector('#navAccount').addEventListener('click', (event) => page_userInfo(whoAmI.userId));

document.querySelector('#filterUserInput').addEventListener('keyup', (event) => upd_usersDiv());

document.querySelector('#loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.querySelector('input[name="loginUsernameForm"]').value;
    const password = document.querySelector('input[name="loginPasswordForm"]').value;

    fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    })
        .then(response => response.json())
        .then(async (data) => {
            if (data.error) {
                popup(`Error: ${data.error} while logging in`, error=true);
                return;
            }
            await fetchWhoAmI();
            popup(`Logged in successfully!`);
            page_home();
        }).catch(err => {
            popup(`Error catched: ${err} while logging in`, error=true);
        })
});

document.querySelector('#registerForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.querySelector('input[name="regNameForm"]').value;
    const surname = document.querySelector('input[name="regSurnameForm"]').value;
    const username = document.querySelector('input[name="regUsernameForm"]').value;
    const password = document.querySelector('input[name="regPasswordForm"]').value;
    const bio = document.querySelector('textarea[name="regBioForm"]').value;

    fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            surname,
            username,
            password,
            bio
        })
    })
        .then(response => response.json())
        .then(data => { 
            if (data.error) {
                if(data.error instanceof Array) {
                    popup(`Error: ${data.error[0].msg} while sign up`, error=true);
                } else {
                    popup(`Error: ${data.error} while sign up`, error=true);
                }
                return;
            }
            document.querySelector('#navLogin').click();
            popup(`Signed up successfully! Please login.`);
        }).catch(err => {
            popup(`Error catched: ${err} while sign up`, error=true);
        })
});

document.querySelector('#newMessageForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const newMessageTextArea = document.querySelector('textarea[name="newMessageTextArea"]');
    const content = newMessageTextArea.value.trim();
    fetch('/api/social/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content
        })
    })
        .then(response => response.json())
        .then(data => {
            if(data.error) {
                if(data.error instanceof Array) {
                    popup(`Error: ${data.error[0].msg} while sending message`, error=true);
                } else {
                    popup(`Error: ${data.error} while sending message`, error=true);
                }
                return;
            }
            newMessageTextArea.value = '';
            upd_userMessagesDiv(whoAmI.userId);
        }).catch(err => {
            popup(`Error catched: ${err} while sending message`, error=true);
        })
});


///////////////
// Handlers //
//////////////

function followUser(userId, follow = true) {
    const methodTOUse = follow ? 'POST' : 'DELETE';
    fetch(`/api/social/followers/${userId}`, {
        method: methodTOUse
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                popup(`Error: ${data.error} while (un)following user`, error=true);
                return;
            }
            const followUser = document.querySelector('#followUser');
            followUser.setAttribute('onclick', `followUser(${userId}, ${!follow})`);
            followUser.innerHTML = follow ? 'Unfollow' : 'Follow';
            followUser.style.color = follow ? '#e32420' : 'blue'; // #e32420 = red
        }).catch(err => {
            popup(`Error catched: ${err} while (un)following user`, error=true);
        })

    upd_userFollowersDiv(userId);
}

function likeMessage(messageId, like = true) {
    const methodTOUse = like ? 'POST' : 'DELETE';
    fetch(`/api/social/like/${messageId}`, {
        method: methodTOUse
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                popup(`Error: ${data.error} while (un)liking message`, error=true);
                return;
            }
        });
}


//////////////
// Updaters //
//////////////

function upd_userInfoDiv(userId) {
    fetch(`/api/social/users/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                popup(`Error: ${data.error} while getting user info`, error=true);
                return;
            }
            const userInfo = document.querySelector('#userInfoDiv');
            userInfo.querySelector('#nameSpan').innerHTML = data[0].name;
            userInfo.querySelector('#surnameSpan').innerHTML = data[0].surname;
            userInfo.querySelector('#usernameSpan').innerHTML = data[0].username;
            userInfo.querySelector('#bioSpan').innerHTML = data[0].bio;
            const followUser = userInfo.querySelector('#followUser');
            followUser.innerHTML = 'Follow';
            followUser.setAttribute('onclick', `followUser(${userId})`);
            followUser.style.color = 'blue';

            if (whoAmI && isAFollower(whoAmI.userId)) {
                followUser.innerHTML = 'Unfollow';
                followUser.setAttribute('onclick', `followUser(${userId}, false)`);
                followUser.style.color = '#e32420'; // red
            }
        }).catch(err => {
            popup(`Error catched: ${err} while getting user info`, error=true);
        });
}

function upd_usersDiv() {
    const q = document.querySelector('#filterUserInput').value.trim();
    fetch(`/api/social/search?q=${q}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                popup(`Error: ${data.error} while searching users`, error=true);
                return;
            }
            const users = document.querySelector('#usersDiv');
            const list = users.querySelector('ul');
            list.innerHTML = '';
            data.forEach(user => {
                const li = document.createElement('li');
                li.classList.add('list-group-item', 'd-flex');
                li.innerHTML = `
                    <div class="text-center" style="min-width:20%;">
                        <strong>${user.username}</strong><br/>
                        <a href="#" onclick="page_userInfo(${user.userId})">More</a>
                    </div>
                    <div style="max-height:140px; overflow-y:auto;">
                        <span>${user.bio}</span>
                    </div>
                `;
                list.appendChild(li);
            });
        }).catch(err => {
            popup(`Error catched: ${err} while searching users`, error=true);
        });
}

function upd_userMessagesDiv(userId) {
    fetch(`/api/social/messages/${userId}`)
        .then(response => response.json())
        .then(data => {
            if(data.error) {
                popup(`Error: ${data.error} while getting user messages`, error=true);
                return;
            }

            const userMessages = document.querySelector('#userMessagesDiv > .col');
            userMessages.innerHTML = 'Messages writed:';
            userMessages.appendChild(messagesListGenerator(data));
        }).catch(err => {
            popup(`Error catched: ${err} while getting user messages`, error=true);
        });
}

function upd_userFeedDiv() {
    fetch(`/api/social/feed`)
        .then(response => response.json())
        .then(data => {
            if(data.error) {
                popup(`Error: ${data.error} while getting user feed`, error=true);
                return;
            }
            const userFeed = document.querySelector('#userFeedDiv > .col');
            userFeed.innerHTML = 'Feed:';
            userFeed.appendChild(messagesListGenerator(data));
        }).catch(err => {
            popup(`Error catched: ${err} while getting user feed`, error=true);
        });
}

function upd_userFollowersDiv(userId) {
    fetch(`/api/social/followers/${userId}`)
        .then(response => response.json())
        .then(data => {
            if(data.error) {
                popup(`Error: ${data.error} while getting user followers`, error=true);
                return;
            }
            const userFollowers = document.querySelector('#userFollowersDiv');
            const list = userFollowers.querySelector('ul');
            list.innerHTML = '';
            data.forEach(follower => {
                const li = document.createElement('li');
                li.setAttribute('data-userid', follower.userId);
                li.classList.add('list-group-item', 'd-flex');
                li.innerHTML = `
                    <div class="text-center" style="min-width:20%;">
                        <strong>${follower.username}</strong><br/>
                        <a href="#" onclick="page_userInfo(${follower.userId})">More</a>
                    </div>
                    <div style="max-height:140px; overflow-y:auto;">
                        <span>${follower.bio}</span>
                    </div>
                `;
                list.appendChild(li);
            });
            if(list.innerHTML === '') {
                const li = document.createElement('li');
                li.classList.add('list-group-item');
                li.innerHTML = `
                    <div class="row justify-content-between">
                        <div class="col-12">
                            Nothing to show here.
                        </div>
                    </div>
                `;
                list.appendChild(li);
            }
        }).catch(err => {
            popup(`Error catched: ${err} while getting user followers`, error=true);
        });
}


///////////
// Utils //
///////////

function messagesListGenerator(data) {
    const list = document.createElement('ul');
    list.classList.add('list-group');
    list.innerHTML = '';
    data.forEach(message => {
        writedOn = new Date(message.writedOn);
        let formatter = (val) => {
            return ("0" + val).slice(-2);
        }
        const formattedWritedOn = `${formatter(writedOn.getDate())}/${formatter(writedOn.getMonth() + 1)}/${writedOn.getFullYear()} (${formatter(writedOn.getHours())}:${formatter(writedOn.getMinutes())})`;

        const li = document.createElement('li');
        li.classList.add('list-group-item');
        let likeMsgAnchor = "";
        if (whoAmI) {
            likeMsgAnchor = `<a href="#" onclick="likeMessage(${message.messageId}); upd_userMessagesDiv(${message.userId}); upd_userFeedDiv()">Like</a>`;
            if (message.liked) {
                likeMsgAnchor = `<a href="#" style="color:#e32420;" onclick="likeMessage(${message.messageId}, false); upd_userMessagesDiv(${message.userId}); upd_userFeedDiv()">Unlike</a>`;
            }
        }

        li.innerHTML = `
            <div class="row">
                <div class="col" style="max-height:100px; overflow-y:auto;">
                    ${message.content}
                </div>
            </div>
            <div class="row justify-content-between">
                <div class="col-8">
                    <span class="font-weight-bold">${message.username} on ${formattedWritedOn}<span>
                </div>
                <div class="col-4 text-right align-self-end">
                    ${message.likes} likes: ${likeMsgAnchor}
                </div>
            </div>
        `;

        list.appendChild(li);
    });
    if(list.innerHTML === '') {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
            <div class="row justify-content-between">
                <div class="col-12">
                    Nothing to show here.
                </div>
            </div>
        `;
        list.appendChild(li);
    }
    return list;
}

function isAFollower(userId) {
    const userFollowersDiv = document.querySelector('#userFollowersDiv');
    const list = userFollowersDiv.querySelector('ul');
    const li = list.querySelector(`li[data-userid="${userId}"]`);
    return li ? true : false;
}

function popup(message, error=false) {
    const popup = document.querySelector('#popup');
    popup.innerHTML = message;
    popup.classList.remove('alert-success', 'alert-danger');
    popup.classList.add(error ? 'alert-danger' : 'alert-success');
    popup.classList.remove('d-none');
    setTimeout(() => {
        popup.classList.add('d-none');
    }, 5000);
}