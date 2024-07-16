// const scrollPage = () => {
//     const appDiv = document.getElementById('app');
//     const commentsContainer = appDiv.querySelector('div.note-scroller');
//     if (commentsContainer) {
//         commentsContainer.scrollTop = commentsContainer.scrollHeight;
//         const currentHeight = commentsContainer.scrollHeight;

//         if (currentHeight > previousHeight) {
//             previousHeight = currentHeight;
//         } else {
//             scrollCount++;
//             if (scrollCount >= maxScrolls) {
//                 clearInterval(scrollInterval);
//                 extractComment();
//             }
//         }
//     } else {
//         console.log('未找到 commentsContainer 元素');
//         clearInterval(scrollInterval);
//     }
// };

// const extractNoteInfo = () => {
//     const regex = /\/explore\/([^?]+)/;
//     const match = window.location.href.match(regex);
//     if (match) {
//         // 假设 __INITIAL_STATE__ 在 window 对象中
//         if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.note && window.__INITIAL_STATE__.note.noteDetailMap) {
//             return window.__INITIAL_STATE__.note.noteDetailMap[match[1]];
//         } else {
//             console.error("__INITIAL_STATE__ 或 noteDetailMap 未定义");
//         }
//     } else {
//         console.error("使用当前链接提取作品 ID 失败", window.location.href);
//     }
// };

// const extractCommentDetails = (noteInfo) => {
//     if (noteInfo && noteInfo.comments && noteInfo.comments.list) {
//         const comments = noteInfo.comments.list.map(comment => ({
//             content: comment.content,
//             createTime: comment.createTime,
//             ipLocation: comment.ipLocation,
//             userInfo: {
//                 nickname: comment.userInfo.nickname,
//                 userId: comment.userInfo.userId
//             }
//         }));
//         const currentTime = noteInfo.currentTime;
//         const noteDetails = {       
//             desc: noteInfo.note.desc,
//             time: noteInfo.note.time,
//             title: noteInfo.note.title,
//             ipLocation: noteInfo.note.ipLocation,
//             interactInfo: {
//                 collectedCount: noteInfo.note.interactInfo.collectedCount,
//                 commentCount: noteInfo.note.interactInfo.commentCount,
//                 likedCount: noteInfo.note.interactInfo.likedCount,
//                 shareCount: noteInfo.note.interactInfo.shareCount
//             },
//             user: {
//                 nickname: noteInfo.note.user.nickname
//             }
//         };

//         return {
//             comments,
//             currentTime,
//             noteDetails
//         };
//     } else {
//         console.error("comments 或 list 未定义");
//         return {
//             comments: [],
//             noteDetails: {}
//         };
//     }
// };

// const noteInfo = extractNoteInfo();

// const details = extractCommentDetails(noteInfo);
// console.log(details);


// let previousHeight = 0;
// let scrollCount = 0;
// const maxScrolls = 10; // 你可以根据需要调整最大滚动次数

// const scrollPage = () => {
//     const appDiv = document.getElementById('app');
//     const commentsContainer = document.querySelector('div.note-scroller');
//     if (commentsContainer) {
//         commentsContainer.scrollTop = commentsContainer.scrollHeight;
//         const currentHeight = commentsContainer.scrollHeight;

//         if (currentHeight > previousHeight) {
//             previousHeight = currentHeight;
//         } else {
//             scrollCount++;
//             if (scrollCount >= maxScrolls) {
//                 clearInterval(scrollInterval);
//                 extractAndLogDetails();
//             }
//         }
//     } else {
//         console.log('未找到 commentsContainer 元素');
//         clearInterval(scrollInterval);
//     }
// };

// const extractNoteInfo = () => {
//     const regex = /\/explore\/([^?]+)/;
//     const match = window.location.href.match(regex);
//     if (match) {
//         // 假设 __INITIAL_STATE__ 在 window 对象中
//         if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.note && window.__INITIAL_STATE__.note.noteDetailMap) {
//             return window.__INITIAL_STATE__.note.noteDetailMap[match[1]];
//         } else {
//             console.error("__INITIAL_STATE__ 或 noteDetailMap 未定义");
//         }
//     } else {
//         console.error("使用当前链接提取作品 ID 失败", window.location.href);
//     }
// };

// const extractCommentDetails = (noteInfo) => {
//     if (noteInfo && noteInfo.comments && noteInfo.comments.list) {
//         const comments = noteInfo.comments.list.map(comment => ({
//             content: comment.content,
//             createTime: comment.createTime,
//             ipLocation: comment.ipLocation,
//             userInfo: {
//                 nickname: comment.userInfo.nickname,
//                 userId: comment.userInfo.userId
//             }
//         }));
//         const currentTime = noteInfo.currentTime;
//         const noteDetails = {       
//             desc: noteInfo.note.desc,
//             time: noteInfo.note.time,
//             title: noteInfo.note.title,
//             ipLocation: noteInfo.note.ipLocation,
//             interactInfo: {
//                 collectedCount: noteInfo.note.interactInfo.collectedCount,
//                 commentCount: noteInfo.note.interactInfo.commentCount,
//                 likedCount: noteInfo.note.interactInfo.likedCount,
//                 shareCount: noteInfo.note.interactInfo.shareCount
//             },
//             user: {
//                 nickname: noteInfo.note.user.nickname
//             }
//         };

//         return {
//             comments,
//             currentTime,
//             noteDetails
//         };
//     } else {
//         console.error("comments 或 list 未定义");
//         return {
//             comments: [],
//             noteDetails: {}
//         };
//     }
// };

// const extractAndLogDetails = () => {
//     const noteInfo = extractNoteInfo();
//     const details = extractCommentDetails(noteInfo);
//     console.log(details);
// };

// // 设置滚动间隔
// const scrollInterval = setInterval(scrollPage, 1000); // 每秒滚动一次

let previousHeight = 0;
let scrollCount = 0;
const maxScrolls = 10; // 你可以根据需要调整最大滚动次数

const scrollPage = () => {
    const appDiv = document.getElementById('app');
    const commentsContainer = document.querySelector('div.note-scroller');
    if (commentsContainer) {
        commentsContainer.scrollTop = commentsContainer.scrollHeight;
        const currentHeight = commentsContainer.scrollHeight;

        if (currentHeight > previousHeight) {
            previousHeight = currentHeight;
        } else {
            scrollCount++;
            if (scrollCount >= maxScrolls) {
                clearInterval(scrollInterval);
                extractAndSaveDetails();
            }
        }
    } else {
        console.log('未找到 commentsContainer 元素');
        clearInterval(scrollInterval);
    }
};

const extractNoteInfo = () => {
    const regex = /\/explore\/([^?]+)/;
    const match = window.location.href.match(regex);
    if (match) {
        // 假设 __INITIAL_STATE__ 在 window 对象中
        if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.note && window.__INITIAL_STATE__.note.noteDetailMap) {
            return window.__INITIAL_STATE__.note.noteDetailMap[match[1]];
        } else {
            console.error("__INITIAL_STATE__ 或 noteDetailMap 未定义");
        }
    } else {
        console.error("使用当前链接提取作品 ID 失败", window.location.href);
    }
};

const extractCommentDetails = (noteInfo) => {
    if (noteInfo && noteInfo.comments && noteInfo.comments.list) {
        const comments = noteInfo.comments.list.map(comment => ({
            content: comment.content,
            createTime: comment.createTime,
            ipLocation: comment.ipLocation,
            userInfo: {
                nickname: comment.userInfo.nickname,
                userId: comment.userInfo.userId
            }
        }));
        const currentTime = noteInfo.currentTime;
        const noteDetails = {       
            desc: noteInfo.note.desc,
            time: noteInfo.note.time,
            title: noteInfo.note.title,
            ipLocation: noteInfo.note.ipLocation,
            interactInfo: {
                collectedCount: noteInfo.note.interactInfo.collectedCount,
                commentCount: noteInfo.note.interactInfo.commentCount,
                likedCount: noteInfo.note.interactInfo.likedCount,
                shareCount: noteInfo.note.interactInfo.shareCount
            },
            user: {
                nickname: noteInfo.note.user.nickname
            }
        };

        return {
            comments,
            currentTime,
            noteDetails
        };
    } else {
        console.error("comments 或 list 未定义");
        return {
            comments: [],
            noteDetails: {}
        };
    }
};

const extractAndSaveDetails = () => {
    const noteInfo = extractNoteInfo();
    const details = extractCommentDetails(noteInfo);
    saveToCSV(details);
};

const saveToCSV = (details) => {
    const { comments, noteDetails } = details;
    const csvRows = [];
    const headers = ['nickname', 'userId', 'createTime', 'ipLocation', 'content'];
    csvRows.push(headers.join(','));

    comments.forEach(comment => {
        const row = [
            comment.userInfo.nickname,
            comment.userInfo.userId,
            comment.createTime,
            comment.ipLocation,
            comment.content
        ];
        csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${noteDetails.title} ${noteDetails.user.nickname}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// 设置滚动间隔
const scrollInterval = setInterval(scrollPage, 1000); // 每秒滚动一次