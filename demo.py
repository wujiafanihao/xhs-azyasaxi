from playwright.sync_api import sync_playwright
import re
import json

def get_note_info(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)  # 无头模式，不显示浏览器界面
        page = browser.new_page()
        page.goto(url)
        
        # 模拟滚动页面
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        
        # 等待页面加载完成
        page.wait_for_timeout(5000)  # 增加等待时间到5秒
        
        # 获取页面内容
        content = page.content()
        
        # 关闭浏览器
        browser.close()
        
        # 解析页面内容
        script_tag = re.search(r'<script.*?window\.__INITIAL_STATE__\s*=\s*({.*?});.*?</script>', content, re.DOTALL)
        if script_tag:
            json_text = script_tag.group(1)
            data = json.loads(json_text)
            
            note_id = url.split('/')[-1].split('?')[0]
            note_data = data['note']['noteDetailMap'][note_id]
            
            return extract_comment_details(note_data)
        else:
            print("未找到 __INITIAL_STATE__")
            print("页面内容片段:")
            print(content[:1000])  # 打印页面内容的前1000个字符，帮助调试
            return None

def extract_comment_details(note_data):
    comments = []
    if 'comments' in note_data and 'list' in note_data['comments']:
        for comment in note_data['comments']['list']:
            comments.append({
                'content': comment['content'],
                'createTime': comment['createTime'],
                'ipLocation': comment.get('ipLocation', ''),
                'userInfo': {
                    'nickname': comment['userInfo']['nickname'],
                    'userId': comment['userInfo']['userId']
                }
            })
    
    note_details = {
        'desc': note_data['note']['desc'],
        'time': note_data['note']['time'],
        'title': note_data['note']['title'],
        'ipLocation': note_data['note'].get('ipLocation', ''),
        'interactInfo': {
            'collectedCount': note_data['note']['interactInfo']['collectedCount'],
            'commentCount': note_data['note']['interactInfo']['commentCount'],
            'likedCount': note_data['note']['interactInfo']['likedCount'],
            'shareCount': note_data['note']['interactInfo']['shareCount']
        },
        'user': {
            'nickname': note_data['note']['user']['nickname']
        }
    }
    
    return {
        'comments': comments,
        'currentTime': note_data['currentTime'],
        'noteDetails': note_details
    }

# 使用示例
url = "https://www.xiaohongshu.com/explore/6693fc6e0000000003026547"
result = get_note_info(url)
if result:
    print(json.dumps(result, ensure_ascii=False, indent=2))