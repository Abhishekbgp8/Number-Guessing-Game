import re

css = open('styles.css','r',encoding='utf-8').read()
css_normal = re.sub(r'\s+','',css)

# Check for guessInput min-width
assert 'min-width:0' in css, 'min-width:0 not set on #guessInput'
# Check for game-controls media
assert '@media(max-width:480px)' in css_normal or '@media(max-width:480px)' in css, 'No mobile media query found'
assert '#submitGuess{width:100%' in css_normal, 'submit guess not set to 100% in mobile query'
assert '@media(max-width:600px)' in css_normal and 'body{overflow:auto' in css_normal, 'body overflow not set for small screens'
assert 'position:sticky' in css_normal, 'game-controls sticky position not applied in mobile query'
assert 'rgba(10,12,20,0.6)' in css_normal, 'default message background not updated for dark theme'
assert '#0b8f5f' in css_normal and '#ff6b6b' in css_normal, 'success or error color not found in stylesheet'

print('CSS checks OK')
