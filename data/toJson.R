library(readr)
db <- read_csv("data_breaches.csv", col_types = cols(`Date Made Public` = col_date(format = "%m/%d/%Y")))
db <- db[which(db$`Total Records` > 0 & !is.na(db$State)), ]
db <- cbind(db$State, db$`Type of breach`, db$`Total Records`, as.character(db$`Date Made Public`))
colnames(db) <- c("State", "Breach_Type", "Total_Records", "Date")
writeLines(toJSON(db), "data.json")