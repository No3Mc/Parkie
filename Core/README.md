# Parkie

* [FAQ General](https://github.com/P4RKI3/.github/wiki#faq-general)

## Company

* [Vision and Values](https://github.com/P4RKI3/.github/wiki/Company#vision-and-values)
* [Company Overview](https://github.com/P4RKI3/.github/wiki/Company#company-overview)
* [Product and services](https://github.com/P4RKI3/.github/wiki/Company#product-and-services)

## Information

* [Client Information](https://github.com/P4RKI3/.github/wiki/Information#client-information)
* [Customer Information](https://github.com/P4RKI3/.github/wiki/Information#customer-information)
* [Park Slots Information](https://github.com/P4RKI3/.github/wiki/Information#park-slots-information)

## Departments

* [Client Management](https://github.com/P4RKI3/.github/wiki/Departments#client-management)
* [Park Slot Management](https://github.com/P4RKI3/.github/wiki/Departments#park-slot-management)
* [Customer Management](https://github.com/P4RKI3/.github/wiki/Departments#customer-management)

## Documentation

* [Backlog](https://github.com/P4RKI3/.github/wiki/Documentation#backlog)
* [Code Explanation](https://github.com/P4RKI3/.github/wiki/Documentation#code-explanation)
* [Core Functionality](https://github.com/P4RKI3/.github/wiki/Documentation#core-functionality)
* [Use Case Descriptions](https://github.com/P4RKI3/.github/wiki/Documentation#use-case-descriptions)
* [Examples of implemented Testing](https://github.com/P4RKI3/.github/wiki/Documentation#examples-of-implemented-testing)
* [Examples of implemented Security](https://github.com/P4RKI3/.github/wiki/Documentation#examples-of-implemented-security)
* [Discussion on shared functionality](https://github.com/P4RKI3/.github/wiki/Documentation#discussion-on-shared-functionality)

This folder has main files which are used to run the [static site](www.parkie.app) on azure.

Directory Structure (Will be changed):

        CORE
        │   index.html (main html)
        │   Parkie.ico (icon for the site)
        │   README.md 
        │   script.js (main js)
        │   style.css (main css)
        │
        ├───database (db files mongodb)
        │       Custdb.js (customer db file) (create own db file for each department)
        │       README.md
        │
        ├───ico (icon files for the index.html)
        │       menu.png
        │       notification.png
        │       profile.png
        │       README.md
        │
        └───routes(routes for the sites) (e.g CustDev, ParkDev, ClientDeb)
            │   README.md
            │
            ├───ClientDev (client development)
            │       README.md (readme for client dev)
            │
            ├───CustDev (customer development)
            │   │   README.md (readme for cust dev)
            │   │
            │   ├───AboutUs (about us)
            │   │       AboutUs.css (css for about us)
            │   │       AboutUs.html (html for about us)
            │   │       AboutUs.js (js for about us)
            │   │
            │   ├───DocnFAQ (documentation and faq)
            │   │       DocnFAQ.css (css for docnfaq)
            │   │       DocnFAQ.html (html for docnfaq)
            │   │       DocnFAQ.js (js for docnfaq)
            │   │
            │   ├───Login (login page)
            │   │       login.css (css for login)
            │   │       login.html (html for login)
            │   │       login.js (js for login)
            │   │
            │   ├───Notifs (notifications)
            │   │       Notifs.json (json for notifs bar)
            │   │
            │   ├───PayMeths (payment methods)
            │   │       PayMeths.css (css for paymeths)
            │   │       PayMeths.html (html for paymeths)
            │   │       PayMeths.js (js for paymeths)
            │   │
            │   ├───Profile (profile page)
            │   │       profile.css (css for profile)
            │   │       profile.html (html for profile)
            │   │       profile.js (js for profile)
            │   │
            │   ├───Promos (promotions page)
            │   │       Promos.css (css for promos)
            │   │       Promos.html (html for promos)
            │   │       Promos.js (js for promos)
            │   │
            │   ├───Register (register page)
            │   │       Register.css (css for register)
            │   │       Register.html (html for register)
            │   │       Register.js (js for register)
            │   │
            │   └───VulRep (vulnerability reports page)
            │           VulRep.css (css for vulrep)
            │           VulRep.html (html for vulrep)
            │           VulRep.js (js for vulrep)
            │
            └───ParkDev (park development)
                │   README.md
                │
                └───MainPg (main page for park dev)
                        index.html
                        script.js
                        style.css
