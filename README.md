# Parkie | English and Urdu Documentation for this project: <https://github.com/P4RKI3/.github/wiki>

**Note:** Wiki is public so `AVOID POSTING CODE THERE`.

Chamber Of Secrets

| Name | Component | Component |
| ----------- | ----------- | ----------- |
| [Umar](https://github.com/itsumarsoomro) | [P2630030](mailto:P2630030@my365.dmu.ac.uk) | [Park slot Booking Component](https://github.com/P4RKI3/.github/wiki/Documentation#park-slot-booking-component) |
| [Nav](https://github.com/navnoor1) | [P2630965](mailto:P2630965@my365.dmu.ac.uk) | [Client Management Component](https://github.com/P4RKI3/.github/wiki/Documentation#client-management-component) |
| [Syed](https://github.com/No3Mc) | [P2652259](mailto:syed.naqvi3@my365.dmu.ac.uk) | [Customer Managment Component](https://github.com/P4RKI3/.github/wiki/Documentation#customer-management-component) |


In order to run django bot you'll need to run the following commands:

    Parkie/Core/routes/CustDev/
    └─$ python manage.py runserver

Also an alternate approach is that there is a draft javascript bot is inside the [bot folder](Core/routes/CustDev/bot/bot.html)



For my own ease:

    git push --delete origin b
    git checkout main
    git branch -D b

Mongodb database connection:

    mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority


To store for 15 mins

    git config --global credential.helper cache

To store permanently

    git config --global credential.helper store

To remove the old cache

    git credential-cache exit

Get info about remote reps

    git remote -v

To remove origin/remote names

    git remote remove origin

gitlab repo syncing

    git remote add gitlab https://gitlab.com/No3Mc/parkie.git
    git fetch --all
    git merge github/main
    git push gitlab main
