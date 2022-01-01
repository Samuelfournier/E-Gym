export const filterContent = (parent, contents, attributes, formRef, user, title = '', tags = []) => {
    let callBy = parent;

    // Les filtres possibles
    let filter = {
        type_id: [],
        type_visibility_id: [],
        categorie_id: [],
        activite_id: [],
        position_id: [],
        title: [],
        tags: [],
    };

    //Rempli le titres
    if (title != '') {
        filter.title.push(title);
    }

    //Rempli les tags
    if (tags.length > 0) {
        filter.tags.push(...tags);
    }


    //Rempli les types
    for (let i = 0; i < attributes.types.length; i++) {
        if (formRef.current[attributes.types[i].name].checked) {
            filter.type_id.push(
                parseInt(formRef.current[attributes.types[i].name].value)
            );
        }
    }


    //Rempli les champs de visibilité
    if (user == null) {
        for (let i = 0; i < attributes.visibilities.length; i++) {
            if (formRef.current[attributes.visibilities[i].name].checked) {
                filter.type_visibility_id.push(
                    parseInt(formRef.current[attributes.visibilities[i].name].value)
                );
            }
        }
    }


    //Rempli les catégories
    for (let i = 0; i < attributes.categories.length; i++) {
        if (formRef.current[attributes.categories[i].name].checked) {
            filter.categorie_id.push(
                parseInt(formRef.current[attributes.categories[i].name].value)
            );
        }
    }

    //Rempli les sports et positions
    for (let i = 0; i < attributes.sports.length; i++) {
        let sportIsChecked = false;
        let hasPositionChecked = false;
        let positionCheckTemp = [];
        let allPositions = [];

        //Si le sport est coché
        if (formRef.current[attributes.sports[i].name].checked) {
            sportIsChecked = true;
        }

        for (let j = 0; j < attributes.sports[i].positions.length; j++) {

            //Si la position est coché, stock la position dans un array temp
            if (formRef.current[attributes.sports[i].name + "_" + attributes.sports[i].positions[j].name].checked) {
                hasPositionChecked = true;
                positionCheckTemp.push(
                    parseInt(formRef.current[attributes.sports[i].name + "_" + attributes.sports[i].positions[j].name].value)
                );
            }

            //Stock tous les positions du sports
            allPositions.push(
                parseInt(formRef.current[attributes.sports[i].name + "_" + attributes.sports[i].positions[j].name].value)
            );
        }

        // Si le sport est à true et qu'il n'y a pas de position : entre tous les positions dans le filter
        if (sportIsChecked && !hasPositionChecked) {
            filter.position_id.push(...allPositions);
        }

        // Si il y a des positions et que la fonction à été appelé par le parent (sport) et que le sport n'Est pas coché :
        // Décoche tous les positions du sport
        if (hasPositionChecked && callBy == formRef.current[attributes.sports[i].name].id && !sportIsChecked) {
            for (let k = 0; k < attributes.sports[i].positions.length; k++) {
                if (formRef.current[attributes.sports[i].name + "_" + attributes.sports[i].positions[k].name].checked) {
                    formRef.current[attributes.sports[i].name + "_" + attributes.sports[i].positions[k].name].checked = false;
                }
            }
            hasPositionChecked = false;
        }

        // Si il a des positions de coché
        if (hasPositionChecked) {

            //si le sport n'est pas coché, le coche
            if (!sportIsChecked) {
                formRef.current[attributes.sports[i].name].checked = true;
            }
            filter.position_id.push(...positionCheckTemp);
        }
    }


    let query = buildFilter(filter);
    const result = filterData(contents, query);
    return result;
};


export const filterContentCreator = (creatorList, name) => {

    let filter = {
        fullName: [],
    };

    if (name != '') {
        filter.fullName.push(name);
    }

    let query = buildFilter(filter);
    const result = filterDataCreator(creatorList, query);
    return result;
}


const filterDataCreator = (data, query) => {

    const filteredData = data.filter((item) => {

        for (let key in query) {
                //Filtre le nom des auteurs
            if (item[key] === undefined || !item[key].toLowerCase().includes(query[key])) {
                return false;
            }
        }
        return true;
    });
    return filteredData;
}

export const filterCategory = (categoryList, name) => {

    let filter = {
        name: [],
    };

    if (name != '') {
        filter.name.push(name);
    }

    let query = buildFilter(filter);
    const result = filterDataCategory(categoryList, query);
    return result;
}
const filterDataCategory = (data, query) => {

    const filteredData = data.filter((item) => {

        for (let key in query) {
                //Filtre le nom des auteurs
            if (item[key] === undefined || !item[key].toLowerCase().includes(query[key])) {
                return false;
            }
        }
        return true;
    });
    return filteredData;
}
export const filterMyContent = (content, formRef, types, title) => {

      // Les filtres possibles
      let filter = {
        type_publication_id: [],
        title: [],
        progress:  []
    };

    //Rempli le titres
    if (title != '') {
        filter.title.push(title);
    }

    //Rempli les types
    if (types != null) {
        for (let i = 0; i < types.length; i++) {
            if (formRef.current[types[i].name].checked) {
                filter.type_publication_id.push(
                    parseInt(formRef.current[types[i].name].value)
                );
            }
        }
    }


    let progressStatus = ['Completed', 'In progress', 'Not started'];

    //Remplie les filtres de progression
    if (formRef.current != null) {
        for (let i = 0; i < progressStatus.length; i++) {
            if (formRef.current[progressStatus[i]].checked) {
                filter.progress.push(formRef.current[progressStatus[i]].value);
            }
        }
    }


    let query = buildFilter(filter);
    const result = filterDataMyContent(content, query);
    return result;

}


const filterDataMyContent = (data, query) => {


    const filteredData = data.filter((item) => {
        for (let key in query) {

            if (item[key] === undefined) {
                return false;
            }

            // regarde tous les autres priorité si elle match avec la carte
            if (key != 'title' && !query[key].includes(item[key])) {
                return false;
            }

            // regarde si les mots tapé dans la barre de recherche existe dans les titres des cartes
            if (key == 'title' && !item[key].toLowerCase().includes(query[key])) {
                return false;
            }

        }
        return true;
    });
    return filteredData;

}



// Filtre les données et retourne le array filtrer
const filterData = (data, query) => {


    const filteredData = data.filter((item) => {
        for (let key in query) {

            if (item[key] === undefined) {
                return false;
            }

            // regarde tous les autres priorité si elle match avec la carte
            if (key != 'title' && key != 'tags' && !query[key].includes(item[key])) {
                return false;
            }

            // regarde si les mots tapé dans la barre de recherche existe dans les titres des cartes
            if (key == 'title' && !item[key].toLowerCase().includes(query[key])) {
                return false;
            }

            // Regarde si le mot du tags existes dans les tag de la carte
            if (key == 'tags' && !query[key].some(tag => item[key].toLowerCase().match(new RegExp("\\b" + tag + "\\b")) != null)) {
                return false;
            }

        }
        return true;
    });
    return filteredData;
};

//Enlève les objets vide qui ne sont pas filtrer
const buildFilter = (filter) => {
    let query = {};
    for (let keys in filter) {
        if (filter[keys].constructor === Array && filter[keys].length > 0) {
            query[keys] = filter[keys];
        }
    }
    return query;
};

export default { filterContent, filterContentCreator, filterMyContent,filterCategory }
