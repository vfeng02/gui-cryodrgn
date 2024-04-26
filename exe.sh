root=${1}
email=${2}

bash runserver.sh $root &
bash rungui.sh $email &