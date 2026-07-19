"""Test configuration.

The engine/model tests are pure Python and need no Home Assistant. When HA is
not installed we expose ``sundial`` as a bare package (its ``__init__`` imports
Home Assistant) so the pure ``engine``/``models``/``const`` modules can still be
imported and unit-tested on their own.
"""

import os
import sys
import types

ROOT = os.path.dirname(os.path.dirname(__file__))
CUSTOM_COMPONENTS = os.path.join(ROOT, "custom_components")
sys.path.insert(0, CUSTOM_COMPONENTS)

try:  # Use the real package when Home Assistant is available.
    import homeassistant  # noqa: F401
except ModuleNotFoundError:
    if "sundial" not in sys.modules:
        package = types.ModuleType("sundial")
        package.__path__ = [os.path.join(CUSTOM_COMPONENTS, "sundial")]
        sys.modules["sundial"] = package
