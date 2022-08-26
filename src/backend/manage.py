#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from django.core.management import execute_from_command_line

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    if sys.argv[1] == 'test':
        if len(sys.argv) > 2:
            if sys.argv[2] == '--functional':
                run_only_functional_tests = ['manage.py', 'test', '--tag=functional']
                execute_from_command_line(run_only_functional_tests)
            elif sys.argv[2] == '--all':
                run_all_tests = ['manage.py', 'test']
                execute_from_command_line(run_all_tests)
            elif sys.argv[2] == '--nokeepdb':
                run_only_unit_tests = ['manage.py', 'test', '--exclude-tag=functional']
                execute_from_command_line(run_only_unit_tests)    
            else:
                run_specific_tests = ['manage.py', 'test', *sys.argv[2:]]
                execute_from_command_line(run_specific_tests)
        else:
            # --keepdb, so a new db won't have to be created for every test
            run_only_unit_tests = ['manage.py', 'test', '--exclude-tag=functional', '--keepdb']
            execute_from_command_line(run_only_unit_tests)
    elif sys.argv[1] == 'run':
        run_command = ['manage.py', 'runserver', '0.0.0.0:8000']
        execute_from_command_line(run_command)
    else:
        execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
