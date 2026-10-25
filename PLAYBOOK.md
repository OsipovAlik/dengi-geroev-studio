# «Деньги героев» — студия шортов (версия GitHub, без компьютера)

Канал: финансовая грамотность через героев классической литературы. Каждый ролик: ~50–60 с,
вертикальный 1080×1920, 24 fps, 7 сцен, рисованная «кукольная» анимация в стиле книжной иллюстрации
(сепия, бумажная фактура), русская озвучка (Piper, голос `denis`, модель с huggingface.co), субтитры по словам с жёлтой
подсветкой, заголовок-лента сверху в каждой сцене, финальная заставка «ДЕНЬГИ ГЕРОЕВ» + «Следующий герой».

Владелец одобрил полностью автоматическую работу: по будням (пн–пт) два ролика, публикация в 12:00 и 15:00
(Asia/Yerevan, +04:00) в YouTube Shorts, Instagram Reels и TikTok через Metricool, без предварительного просмотра.

## Ключевые данные
- Репозиторий: `OsipovAlik/dengi-geroev-studio` (публичный). В корне — вся студия (этот файл, код, `episodes.json`).
  Ветка `main` — рабочая: изменения `episodes.json` и новых `charsN.py` коммить и пушь прямо в `main`.
- Видео хранятся в репозитории: `videos/NN_<hero>_short.mp4` (создание Release запрещено политикой сессии); публичная ссылка — `https://raw.githubusercontent.com/OsipovAlik/dengi-geroev-studio/main/videos/NN_<hero>_short.mp4`. Делать ровно два ролика в день, не готовить впрок.
  Публичная ссылка: `https://github.com/OsipovAlik/dengi-geroev-studio/releases/download/NN/NN_<hero_latin>_short.mp4`.
- Metricool brand/blogId: `7557386`, часовой пояс `Asia/Yerevan`. Сети: Instagram `dengi_geroev`, YouTube, TikTok `dengi_geroev`.
- Компьютер и Google Диск больше не нужны.

## Порядок работы (на каждый ролик)
1. **Окружение (один раз за запуск).** `bash setup.sh .` из корня репозитория (≈1–2 мин): ставит в
   `/home/claude/tts_venv` Piper (модель `denis` качается с huggingface.co в `/home/claude/piper_voices`) и RHVoice,
   проверяет оба голоса.
2. **Выбор героя.** `episodes.json` → первый элемент `queue`. Номер NN = последний `published.n` + 1 (две цифры).
   `NEXT_HERO` на заставке = герой, который будет первым в очереди после этого ролика (заглавными).
3. **Рабочая папка** вне репозитория, например `/home/claude/epNN`: скопируй туда `*.py` из корня,
   удали `script.py/scenes.py/episode_sfx.py`, если попали. Каждый ролик — своя папка, `frames/` пустая перед рендером.
4. **Сценарий** (`script.py`, формат как в `examples/*/script.py`):
   - 7 сцен: крючок → контекст → ошибка/история героя → цифры/урок → современная параллель → правило → вопрос зрителю.
   - ~95–115 слов, итог 50–60 с (проверь по выводу tts.py, при > 60 с сокращай).
   - В тексте для TTS числа словами; в субтитрах цифрами, НО большие числа пиши как «40 тыс.», а не «40 000»
     (иначе субтитр разрывает число и показывает одно «000»).
   - Факты из произведения — только достоверные; финансовые цифры — консервативные, арифметику проверь кодом.
   - `HEADLINES` — 7 коротких лент заглавными (≤ ~28 символов), `LEAD_IN`, `TAIL`, `SENT_GAP`, `NEXT_HERO`.
5. **Озвучка:** `/home/claude/tts_venv/bin/python tts.py denis` → `vo.wav`, `timeline.json`.
   Голос `denis` (Piper) — основной для всех новых роликов, по выбору владельца. Старый голос RHVoice `aleksandr`
   (`tts.py aleksandr`) — только если Piper или модель с huggingface.co не ставится; тогда напиши об этом в отчёте.
6. **Персонажи.** Готовые: `chars.py` (Холмс, Ватсон, миссис Хадсон), `chars2.py` (Раскольников, процентщица),
   `chars3.py` (Плюшкин, Чичиков), `chars4.py` (Микобер), `chars5.py` (Стрекоза, Муравей), `chars6.py` (Скрудж, Боб Крэтчит).
   Для нового героя — новый `charsN.py` по образцу `chars6.py`; дизайн оригинальный, не как в экранизациях.
   Сначала тестовый лист персонажа → посмотри (Read картинки) → поправь. Новый модуль потом закоммить в `main`.
7. **Сцены** (`scenes.py`): `from base import *` + свои персонажи, 7 функций `sceneN(t, dur) -> (RGBA img, cam)`,
   `cam = dict(zoom, cx, cy)` — всегда все три ключа. В конце `SCENES = [...]`. Лучшие образцы: `examples/scrooge`,
   `examples/strekoza`, `examples/micawber`, `examples/plushkin`.
   Правила: фоны через `BD(opaque=True)` + `@cached`; полупрозрачное — на отдельном слое + `alpha_composite`.
   Субтитры занимают y≈1300–1600, лента y≈200–300: **лица персонажей держи вне зоны субтитров**
   (лицо выше ~1250 или ниже ~1650), текст на сценах — вне этих зон.
8. **Проверка кадров** до рендера: `python3 test_scenes.py 0.3 ... (7 значений)` → `t_scenes.png`, 2–3 момента на сцену.
9. **Звук:** `episode_sfx.py` (образцы в examples), затем `python3 audio.py timeline.json vo.wav mix.wav`.
10. **Рендер в фоне** (команды в Bash ограничены ~2 мин!): `nohup python3 render.py > render.log 2>&1 &`,
    затем проверяй `tail -1 render.log` раз в 1–2 мин (~8–10 мин). Кадров должно быть ceil(total×24), Traceback — нет.
11. **Кодирование в фоне:** `nohup bash encode.sh NN /home/claude/out/NN_<hero>_short.mp4 > enc.log 2>&1 &`
    (≈3 мин, ждать `ENCDONE`; предупреждение «slice=P but 2pass stats say B» безвредно). Перед повтором удаляй `/tmp/plNN*`.
    НИКОГДА не делай `pkill -f encode.sh` — это убивает собственную оболочку; останавливай ffmpeg по PID.
    Вытащи 8–10 кадров из MP4 и посмотри итог; проверь звук (`volumedetect`) и длительность (`ffprobe`).
12. **Релиз:** `gh release create NN /home/claude/out/NN_<hero>_short.mp4 --repo OsipovAlik/dengi-geroev-studio --title "NN <Герой>" --notes "<урок>"`.
    Проверь ссылку: `curl -sIL <url> | grep -iE '^HTTP|content-length'` (должно быть 200 и размер файла).
13. **Metricool** (`createScheduledPost`, blogId `7557386`). Время: ролик №1 — сегодня 12:00 `+04:00`,
    ролик №2 — 15:00 `+04:00`; если до времени < 20 мин — ближайшее время ≥ сейчас+20 мин, интервал между роликами ≥ 2 ч.
    - **YouTube** первым: providers `[{"network":"youtube"}]`, media = ссылка релиза, `youtubeData`: title (≤ 70 символов,
      вопрос/интрига + эмодзи), `"type":"short"`, `"privacy":"public"`, 15–20 тегов (первый — «деньги героев»),
      `"category":"EDUCATION"`, `"madeForKids":false`, `"isAiGeneratedContent":false`. Текст: крючок, урок с цифрой, вопрос,
      источник, дисклеймер «Не финансовая рекомендация, а объяснение принципа.», хэштеги #деньгигероев #финансы … #shorts.
      Ответ содержит `media` с URL `static.metricool.com/...mp4` — используй его для двух следующих постов.
    - **Instagram:** providers `[{"network":"instagram"}]`, media = URL static.metricool.com, `videoCoverMilliseconds` 1700,
      `instagramData`: `{"type":"REEL","showReelOnFeed":true,"collaborators":[],"isAiGenerated":false}`.
      Подпись: крючок, 2–3 абзаца, вопрос 👇, источник, дисклеймер, «Следующий герой — … Подпишись 🔔», 7–9 хэштегов, #reels.
    - **TikTok:** providers `[{"network":"tiktok"}]`, media = URL static.metricool.com, `videoCoverMilliseconds` 1700,
      `tiktokData`: `{"privacyOption":"PUBLIC_TO_EVERYONE","title":"<короткий заголовок>","disableComment":false,
      "disableDuet":false,"disableStitch":false,"commercialContentThirdParty":false,"commercialContentOwnBrand":false,
      "autoAddMusic":false,"isAigc":false}`. Подпись короче (до ~2000 знаков): крючок, урок, вопрос, дисклеймер, 5–7 хэштегов, #fyp.
    - Для каждого ролика: либо все три поста, либо (при неустранимой ошибке) — ни одного; описать проблему в отчёте.
14. **Учёт:** перенеси героя из `queue` в `published` (n, hero, lesson, date, file) в `episodes.json` (формат: одна запись
    на строку), закоммить и `git push origin HEAD:main`. Если в очереди < 3 героев — допиши новых из общественного достояния.
15. **Отчёт** (по-русски, коротко): герой, урок, время, ссылки plannerUrl всех постов, что пошло не так.

## Ограничения
- Только персонажи из общественного достояния. Никаких Disney/Marvel/современных фильмов и узнаваемых образов актёров.
- Не давать конкретных инвестиционных советов (не «купи X»); объяснять принципы.
- Не публиковать сломанный ролик (пустые кадры, лица под субтитрами или обрезаны, нет звука).

## Если `gh release create` не работает
GraphQL из облачной сессии недоступен — используй REST:
```
ID=$(gh api -X POST repos/OsipovAlik/dengi-geroev-studio/releases -f tag_name=NN -f name="NN <Герой>" -f target_commitish=main --jq .id)
curl -sS -X POST -H "Authorization: Bearer $(gh auth token)" -H "Content-Type: video/mp4" \
  --data-binary @/home/claude/out/NN_<hero>_short.mp4 \
  "https://uploads.github.com/repos/OsipovAlik/dengi-geroev-studio/releases/$ID/assets?name=NN_<hero>_short.mp4"
```
