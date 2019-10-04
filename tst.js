// Page container handler:
const DOM_PAGE_CONTAINER_CLASS = '_9eogI';
//var pageContainer = document.getElementsByClassName(DOM_PAGE_CONTAINER_CLASS)[0];
var pageContainer = document.getElementById('react-root');

// Mutation observer for page changing:
if(pageContainer != null){
  const pageContainerObserver = new MutationObserver(
    function(mutations){
      for(var i = 0; i < mutations.length; i++){
        if(mutations[i].addedNodes.length > 0 && mutations[i].addedNodes[0].classList.contains(DOM_PAGE_CONTAINER_CLASS)){
          console.log('Page changed');
        }
      }
    }
  );
  pageContainerObserver.observe( pageContainer, {childList: true} );
}
