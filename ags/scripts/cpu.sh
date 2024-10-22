# #############
# ## CREDITS ##
# #############
# Kokabiel, October 21

mpstat | awk '$12 ~ /[0-9.]+/ { print int(100 - $13)"%" }'