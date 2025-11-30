import io
import sys
from unittest.mock import patch
import numbergames

# Helper to run game with mocked randint and inputs and capture output

def run_game_with_random_and_inputs(random_value, inputs):
    # Monkeypatch randint in numbergames module
    numbergames.randint = lambda a,b: random_value

    # Patch input to provide inputs sequentially
    with patch('builtins.input', side_effect=inputs):
        # Capture stdout
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        try:
            numbergames.game(range(1,101))
            output = sys.stdout.getvalue()
        finally:
            sys.stdout = old_stdout
    return output


# Test cases

print('Test 1: guess lower but within 5 -> expect close message')
out1 = run_game_with_random_and_inputs(50, ['47', '50'])
print(out1)

print('Test 2: guess higher and far -> expect too high message')
out2 = run_game_with_random_and_inputs(50, ['60', '50'])
print(out2)

print('Test 3: guess higher but within 5 -> expect close message')
out3 = run_game_with_random_and_inputs(50, ['54', '50'])
print(out3)

print('Test 4: guess lower and far -> expect too low message')
out4 = run_game_with_random_and_inputs(50, ['40', '50'])
print(out4)
