from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import sys
import os
import importlib.util
import glob

# Ensure the modules directory is in the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../modules')))

# Import the modules
facebook_fetcher = importlib.util.spec_from_file_location("facebook_fetcher", os.path.abspath(os.path.join(os.path.dirname(__file__), '../modules/facebook_fetcher.py')))
facebook_fetcher_module = importlib.util.module_from_spec(facebook_fetcher)
facebook_fetcher.loader.exec_module(facebook_fetcher_module)

gemini = importlib.util.spec_from_file_location("gemini", os.path.abspath(os.path.join(os.path.dirname(__file__), '../modules/gemini.py')))
gemini_module = importlib.util.module_from_spec(gemini)
gemini.loader.exec_module(gemini_module)

insta_fetcher = importlib.util.spec_from_file_location("insta_fetcher", os.path.abspath(os.path.join(os.path.dirname(__file__), '../modules/insta_fetcher.py')))
insta_fetcher_module = importlib.util.module_from_spec(insta_fetcher)
insta_fetcher.loader.exec_module(insta_fetcher_module)

insta_processor = importlib.util.spec_from_file_location("insta_processor", os.path.abspath(os.path.join(os.path.dirname(__file__), '../modules/insta_processor.py')))
insta_processor_module = importlib.util.module_from_spec(insta_processor)
insta_processor.loader.exec_module(insta_processor_module)

merged = importlib.util.spec_from_file_location("merged", os.path.abspath(os.path.join(os.path.dirname(__file__), '../modules/merged.py')))
merged_module = importlib.util.module_from_spec(merged)
merged.loader.exec_module(merged_module)

app = FastAPI()

@app.post("/facebook-fetch")
async def facebook_fetch(request: Request):
    try:
        data = await request.json()
        profile_url = data.get("profile_url")
        api_key = os.getenv("FACEBOOK_API_KEY")  # Set this in your .env
        scraper = facebook_fetcher_module.FacebookScraper(api_key)
        result = scraper.fetch_posts_from_profile(profile_url)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/gemini")
async def gemini_endpoint(request: Request):
    try:
        data = await request.json()
        file_paths = data.get("file_paths", [])
        analyzer = gemini_module.GeminiAnalyzer()
        result = analyzer.analyze(file_paths)
        return {"result": result}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/insta-fetch")
async def insta_fetch(request: Request):
    try:
        data = await request.json()
        username = data.get("username")
        import instaloader
        loader = instaloader.Instaloader()
        profile = instaloader.Profile.from_username(loader.context, username)
        posts = profile.get_posts()
        post_urls = []
        for i, post in enumerate(posts):
            if i >= 5:
                break
            post_urls.append(post.url)
        return {"post_urls": post_urls}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/insta-process")
async def insta_process(request: Request):
    try:
        data = await request.json()
        post_url = data.get("post_url")
        processor = insta_processor_module.InstagramProcessor()
        result = processor.process_post(post_url)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/merged-process")
async def merged_process(request: Request):
    try:
        data = await request.json()
        post_url = data.get("post_url")
        GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
        processor = merged_module.InstagramProcessor(GOOGLE_API_KEY=GOOGLE_API_KEY)
        result = processor.process_post(post_url)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)}) 