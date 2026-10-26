#!/bin/bash
# One-time setup per fresh session. Usage: bash setup.sh /path/to/_studio
set -e
STUDIO=$(cd "${1:-$(dirname "$0")}" && pwd)
python3 -c "import numpy, scipy, PIL" 2>/dev/null || pip install --break-system-packages -q numpy scipy pillow
which ffmpeg >/dev/null
VENV=${TTS_VENV:-/home/claude/tts_venv}
if [ ! -x $VENV/bin/python ] || ! $VENV/bin/python -c "import rhvoice_wrapper_bin" 2>/dev/null; then
  python3 -m venv --system-site-packages $VENV
  $VENV/bin/pip install -q --no-deps rhvoice-wrapper==0.8.0 rhvoice-wrapper-data==0.5.0
  SP=$($VENV/bin/python -c "import site;print(site.getsitepackages()[0])")
  tar xzf "$STUDIO/rhvoice_bin.tar.gz" -C "$SP"
  sed -i '201s/.*/    return lib_path/' "$SP/rhvoice_wrapper/rhvoice_bindings.py"
fi
# Main voice: Microsoft Edge "dmitry" (ru-RU-DmitryNeural) via edge-tts from PyPI, online
( set -e
  $VENV/bin/python -c "import edge_tts" 2>/dev/null || $VENV/bin/pip install -q edge-tts
  # session proxy re-signs TLS: trust its CA in the venv's certifi bundle (edge-tts uses certifi)
  if [ -s /root/.ccr/ca-bundle.crt ]; then
    C=$($VENV/bin/python -c "import certifi;print(certifi.where())")
    grep -q "$(sed -n 2p /root/.ccr/ca-bundle.crt)" "$C" || cat /root/.ccr/ca-bundle.crt >> "$C"
  fi
  $VENV/bin/python - <<'PY'
import asyncio, os, tempfile, time, edge_tts
err = "empty audio"
for i in range(12):
    p = tempfile.mktemp(suffix=".mp3")
    try:
        asyncio.run(edge_tts.Communicate("Проверка голоса.", "ru-RU-DmitryNeural").save(p))
        if os.path.getsize(p) > 0:
            print("Edge OK: dmitry"); break
    except Exception as e:
        err = e
    time.sleep(3)
else:
    raise SystemExit(f"edge failed: {err}")
PY
) || echo "EDGE FAILED: голос dmitry недоступен, используй tts.py denis и напиши об этом в отчёте"
# Piper (fallback voice "denis"): package from PyPI, model from huggingface.co
PIPER_DIR=${PIPER_DIR:-/home/claude/piper_voices}
HF=https://huggingface.co/rhasspy/piper-voices/resolve/main/ru/ru_RU/denis/medium
( set -e
  $VENV/bin/python -c "import piper" 2>/dev/null || $VENV/bin/pip install -q piper-tts==1.8.0
  mkdir -p $PIPER_DIR
  for f in ru_RU-denis-medium.onnx ru_RU-denis-medium.onnx.json; do
    if [ ! -s $PIPER_DIR/$f ]; then
      curl -fsSL --retry 3 -o $PIPER_DIR/$f.part "$HF/$f"
      mv $PIPER_DIR/$f.part $PIPER_DIR/$f
    fi
  done
  $VENV/bin/python -c "
from piper import PiperVoice
v = PiperVoice.load('$PIPER_DIR/ru_RU-denis-medium.onnx')
assert sum(len(c.audio_int16_array) for c in v.synthesize('Проверка голоса.')) > 0
print('Piper OK: denis')"
) || echo "PIPER FAILED: голос denis недоступен, используй tts.py aleksandr и напиши об этом в отчёте"
$VENV/bin/python - <<'PY'
import rhvoice_wrapper_bin as b, rhvoice_wrapper_data as d
from rhvoice_wrapper import TTS
t = TTS(threads=1, lib_path=b.lib_path, data_path=d.data_path, quiet=True)
assert 'aleksandr' in t.voices, t.voices
print("TTS OK:", sorted(v for v in t.voices if v in ('aleksandr','anna','elena','irina')))
import os; os._exit(0)
PY
