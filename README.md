A simple TDS app. Allows one to add a short link (generated on backend from randomly selected symbols of SHORT_URL_LENGTH length) -- this is a simple system so no hashing algorithms or creation of short links from DB keys are used, although it can be easily extended to accomodate those needs. Displays statistics for clicks and ips.
Also comes with a simple register/login/logout flow.
Required envvars are SECRET_KEY and DATABASE_URL (of form 'postgresql://user:user@localhost/db-name')
