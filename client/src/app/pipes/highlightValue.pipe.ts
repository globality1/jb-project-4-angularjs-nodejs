import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'highlightValue' // This is the pipe name!
})
export class highlightValuePipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer){}
    
    // transforming html text to be marked by input value
    public transform(value: any, args: any): any {
        if (!args) {
          return value;
        }
        // Match in a case insensitive maneer
        const re = new RegExp(args, 'gi');
        const match = value.match(re);
    
        // If there's no match, just return the original value.
        if (!match) {
          return value;
        }
        const replacedValue ='<span class="highlight">' + value + "</span>";
        return this.sanitizer.bypassSecurityTrustHtml(replacedValue)
      }
      
}


