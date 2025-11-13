

interface ImgConfig{
    src? : string;//TODO nbedlha b darori ydakhelha 
    alt?: string;
    classes? : string[];
}

interface InputConfig {
    type?:string,
    placeholder?:string,
    classes?:string[],
}

interface ButtonConfig{
    classes? : string[];
}

interface SpanConfig{
    textContent?:string;
    classes? : string[];

}

function createElement(element:string): HTMLElement{
    return document.createElement(element);
}


function addClass(element:HTMLElement,...classname:string[]):void
{
    element.classList.add(...classname);
}


function appendTo(elementA:HTMLElement,...element2:HTMLElement[]):void{
    elementA.append(...element2);
}


function createImg(config:ImgConfig):HTMLImageElement{
    const img = createElement("img") as HTMLImageElement;
    if(config.src)img.src = config.src;
    if(config.alt)img.alt = config.alt;
    if(config.classes)addClass(img,...config.classes);
    return img;
}

function createElementWithClasses(elementName:string,...classes:string[]):HTMLElement{
    const element = createElement(elementName);
    addClass(element,...classes);
    return element;
}


function createChild(parent:HTMLElement,elementName:string,...classes:string[]){
    const element = createElementWithClasses(elementName,...classes);
    parent.append(element);
    return element;
}


function createInput(config:InputConfig):HTMLInputElement{
    const input = createElement("input") as HTMLInputElement;
    if(config.type)input.type = config.type;
    if(config.placeholder)input.placeholder = config.placeholder;
    if(config.classes)addClass(input,...config.classes);
    return input;
}
function createButton(config:ButtonConfig):HTMLButtonElement{
    const Button = createElement("button") as HTMLButtonElement;
    if(config.classes)addClass(Button,...config.classes);
    return Button
}



function createSpan(config:SpanConfig):HTMLSpanElement{
    const span = createElement("span") as HTMLSpanElement;
    if(config.textContent)span.textContent = config.textContent;
    if(config.classes)addClass(span,...config.classes);
    return span;
}

export const DOM = {
createElement,
addClass,
appendTo,
createImg,
createElementWithClasses,
createChild,
createInput,
createButton,
createSpan,
}