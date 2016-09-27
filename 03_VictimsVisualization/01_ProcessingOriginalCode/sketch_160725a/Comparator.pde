class SortRecords implements Comparator {

	String metricToSortOn;

	SortRecords(String _metricToSortOn){
		metricToSortOn = _metricToSortOn;
	}

	public int compare(Object a1, Object a2) {
		if (metricToSortOn == "yearEvent"){
			String int1 = ((Victims) a1).eventDate;
			String int2 = ((Victims) a2).eventDate;
			return int1.compareTo(int2);
		}
		else if (metricToSortOn == "gender"){
			String genero1 = ((Victims) a1).genero;
			String genero2 = ((Victims) a2).genero;
			return genero2.compareTo(genero1);
		}
		else if (metricToSortOn == "report"){
			String report1 = ((Victims) a1).reportDate;
			String report2 = ((Victims) a2).reportDate;
			return report1.compareTo(report2);
		}
		else if (metricToSortOn == "eventActor"){
			String actor1 = ((Victims) a1).actorEvent;
			String actor2 = ((Victims) a2).actorEvent;
			return actor2.compareTo(actor1);
		}
		else if (metricToSortOn == "typeEvent"){
			String actor1 = ((Victims) a1).sortType;
			String actor2 = ((Victims) a2).sortType;
			return actor2.compareTo(actor1);	
		}
		else if (metricToSortOn == "ethnicitySort"){
			String actor1 = ((Victims) a1).ethnicity;
			String actor2 = ((Victims) a2).ethnicity;
			return actor2.compareTo(actor1);	
		}
		else{
			return 0;
		}
	}
}