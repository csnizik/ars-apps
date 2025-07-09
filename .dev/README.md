# Dev notes

## Dashboard

Create an Animal Dashboard (View or Layout Builder display) that mimics the folder metaphor:

- Tab: Summary
- Tab: Lifecycle records (Lambing, Weaning, Pedigree)
- Tab: Measurements
- Tab: Group Assignments
- Tab: Notes / Observations

## Field formatting

```md
| Format                                   | Entity | Field   |
|------------------------------------------|--------|---------|
| Duration, in years, no decimals          | lamb   | adam    |
| Julian day                               | lamb   | several |
| MMDDYY                                   | lamb   | bday    |
| MM/DD/YYYY                               | lamb   | datebn  |
| Last 2 digits of year                    | lamb   | YR      |
| Age, half and full if > 1, days when < 1 | inv    | age     |
|-------------------------------------------------------------|
```
