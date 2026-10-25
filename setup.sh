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
$VENV/bin/python - <<'PY'
import rhvoice_wrapper_bin as b, rhvoice_wrapper_data as d
from rhvoice_wrapper import TTS
t = TTS(threads=1, lib_path=b.lib_path, data_path=d.data_path, quiet=True)
assert 'aleksandr' in t.voices, t.voices
print("TTS OK:", sorted(v for v in t.voices if v in ('aleksandr','anna','elena','irina')))
import os; os._exit(0)
PY
