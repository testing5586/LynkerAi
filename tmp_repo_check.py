import asyncio
from open_notebook.database.repository import repo_query

async def main():
    try:
        res = await repo_query("INFO FOR DB;")
        print("OK INFO", res)
    except Exception as e:
        print("ERR", e)

asyncio.run(main())
