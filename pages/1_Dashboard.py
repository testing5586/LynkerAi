import random
from datetime import datetime, timedelta

import pandas as pd
import requests
import streamlit as st

from pages.stream_app.utils import setup_page, load_theme_css


def header():
    st.markdown(
        """
        <div class="lynker-header">
          <div style="font-weight:700;">LynkerAi Knowledge Base</div>
          <div class="right"><span>Master Lily</span><div class="lynker-avatar"></div></div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def gen_series(n=12, base=40, span=40):
    return [base + random.random() * span for _ in range(n)]


setup_page("Dashboard", only_check_mandatory_models=False)
if load_theme_css:
    load_theme_css()
header()

c1, c2 = st.columns(2)
with c1:
    st.caption("过往断言命中率曲线")
    try:
        r = requests.get("http://127.0.0.1:5055/api/chart/pastAccuracy", timeout=5)
        if r.ok:
            payload = r.json()
            xs = [p.get("x", i + 1) for i, p in enumerate(payload)]
            ys = [p.get("y", 0) for p in payload]
            past = pd.DataFrame({"x": xs, "y": ys})
        else:
            past = pd.DataFrame({"x": list(range(1, 13)), "y": gen_series(12, 40, 40)})
    except Exception:
        past = pd.DataFrame({"x": list(range(1, 13)), "y": gen_series(12, 40, 40)})
    st.line_chart(past, x="x", y="y", height=180)
with c2:
    st.caption("未来断言命中率曲线")
    try:
        r = requests.get("http://127.0.0.1:5055/api/chart/futureAccuracy", timeout=5)
        if r.ok:
            payload = r.json()
            xs = [p.get("x", i + 1) for i, p in enumerate(payload)]
            ys = [p.get("y", 0) for p in payload]
            future = pd.DataFrame({"x": xs, "y": ys})
        else:
            future = pd.DataFrame({"x": list(range(1, 13)), "y": gen_series(12, 30, 50)})
    except Exception:
        future = pd.DataFrame({"x": list(range(1, 13)), "y": gen_series(12, 30, 50)})
    st.line_chart(future, x="x", y="y", height=180)

left, right = st.columns([4, 1])
with right:
    with st.container(border=True):
        st.caption("Energy Value")
        st.markdown(
            "<div style='text-align:center;font-size:42px;font-weight:800;color:#e6b93c'>85</div>",
            unsafe_allow_html=True,
        )

st.subheader("八字批命案例")
now = datetime.now()
try:
    rr = requests.get("http://127.0.0.1:5055/api/report/baziCases", timeout=6)
    if rr.ok:
        data = rr.json()
        rows = []
        for item in data:
            rows.append({
                "Video": item.get("video", "video"),
                "Client": item.get("client", ""),
                "Accuracy": item.get("accuracy", 0),
                "Date": item.get("date", ""),
                "Remarks": item.get("remarks", ""),
                "Prediction": item.get("prediction", ""),
            })
    else:
        raise RuntimeError("fallback")
except Exception:
    rows = [
        {
            "Video": "video (click to view)",
            "Client": "蔡清梅女士\n51岁中国人在职老师，七杀先天命，死门。擅事易\n虎头蛇尾，成败多，内心缺乏自信感，夫妻缘分浅。",
            "Accuracy": 55,
            "Date": (now - timedelta(days=30)).strftime("%d %b %Y"),
            "Remarks": "此命主四火大旺，伤官见官，我第一次见。有研究价值。",
            "Prediction": "2025年5月会有大财进账。\n理由：2025年偏财旺",
        },
        {
            "Video": "video (click to view)",
            "Client": "杨老板\n65岁中国人，七杀命，白富自手起家。",
            "Accuracy": 72,
            "Date": (now - timedelta(days=300)).strftime("%d %b %Y"),
            "Remarks": "此命主七杀见官，大富贵命，有研究价值。",
            "Prediction": "2026年将会双火夺命主\n理由：2026偏财双火夺命主",
        },
    ]

st.dataframe(pd.DataFrame(rows), use_container_width=True)
st.caption("Pagination: 1, 2, 3, 4, 5, 6…")

with st.container(border=True):
    st.caption("Ask anything（AI Assistant here）")
    _ = st.text_area("", placeholder="Type your question…", height=90, label_visibility="collapsed")
    st.button("Send")

