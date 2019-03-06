library(readr)
library(RJSONIO)
db <- read_csv("data_breaches.csv", col_types = cols(`Date Made Public` = col_date(format = "%m/%d/%Y")))
db <- db[which(!is.na(db$State)), ]
db$`Total Records`[which(db$`Total Records` == 0)] <- db$`Total Records`[which(db$`Total Records` == 0)] + 1.001
db <- cbind(db$State, db$`Type of breach`, db$`Total Records`, as.character(db$`Date Made Public`))
colnames(db) <- c("State", "Breach_Type", "Total_Records", "Date")
state.names <- c(state.name[1:8], "District Of Columbia", state.name[9:50])
states.list <- c()
for(state in state.names){
  temp <- db[which(db[,1] == state), 2:4]
  temp.json <- toJSON(temp)
  temp.breach <- "[ {\"Breaches\": [ {"
  temp.state <- paste("\\} \\], \"State\": \"", state, '\"\\} \\]', sep = "")
  temp.json <- gsub('\\[ \\{', temp.breach, temp.json)
  temp.json <- gsub('\\} \\]', temp.state, temp.json)
  states.list <- c(states.list, fromJSON(temp.json))
}
writeLines(toJSON(states.list, pretty = T), "data.json")