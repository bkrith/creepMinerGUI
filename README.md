# creepMinerGUI

Installation:

npm install

npm start

Already build:

https://drive.google.com/drive/folders/0B-VO0irYuQ-_clMwRVlnZDlOYlE?usp=sharing


version 1.2.0

fixed resize issue
fixed real burst address in app header
fixed erasing mining.conf issue in 1st time setting of the field miner path
added tray icon enable/disable functionality
fixed values in chart
added refresh button for the Wallet infos
added better bottom status bar messages
added log panel
added 1st time setup wizard
added mining.conf backup in 1st time run
added restore / backup button mining.conf from backup
added dont show up again / cancel in wizard

add ws ip for remote connection option
add extra options from dev branch
add error infos from miner (?)
add hdd time delay records





type: number (1-8)

enum Priority
{
    PRIO_FATAL = 1,         /// A fatal error. The application will most likely terminate. This is the highest priority.
    PRIO_CRITICAL = 2,      /// A critical error. The application might not be able to continue running successfully.
    PRIO_ERROR = 3,         /// An error. An operation did not complete successfully, but the application as a whole is not affected.
    PRIO_WARNING = 4,       /// A warning. An operation completed with an unexpected result.
    PRIO_NOTICE = 5,        /// A notice, which is an information with just a higher priority.
    PRIO_INFORMATION = 6,   /// An informational message, usually denoting the successful completion of an operation.
    PRIO_DEBUG = 7,         /// A debugging message.
    PRIO_TRACE = 8          /// A tracing message. This is the lowest priority.
};

text: string (text of the message)
source: string (source of the message, for example "miner", "nonceSubmitter", "config")
line: number (number of line of the message in source code)
file: string (name of the file of the message in source code)
time: string (time of the message)